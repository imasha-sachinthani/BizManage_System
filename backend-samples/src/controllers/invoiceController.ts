import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { body, validationResult, param } from 'express-validator';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    companyId: string;
  };
}

// Validation middleware for invoice creation
export const validateInvoice = [
  body('clientId').isString().notEmpty(),
  body('items').isArray({ min: 1 }),
  body('items.*.description').isString().notEmpty(),
  body('items.*.quantity').isFloat({ gt: 0 }),
  body('items.*.unitPrice').isFloat({ gt: 0 }),
  body('items.*.vatRate').isFloat({ min: 0, max: 100 }),
  body('dueDate').isISO8601(),
  body('currency').optional().isString(),
  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Generate invoice number
const generateInvoiceNumber = async (companyId: string): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      companyId,
      invoiceNumber: {
        startsWith: prefix,
      },
    },
    orderBy: { invoiceNumber: 'desc' },
  });

  let nextNumber = 1;
  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.invoiceNumber.replace(prefix, ''));
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
};

// Create invoice
export const createInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { clientId, items, dueDate, notes, terms, currency = 'LKR' } = req.body;
    const companyId = req.user!.companyId;

    // Verify client belongs to company
    const client = await prisma.client.findFirst({
      where: { id: clientId, companyId },
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Calculate totals
    let subtotal = 0;
    let totalVAT = 0;

    const processedItems = items.map((item: any) => {
      const itemTotal = item.quantity * item.unitPrice;
      const vatAmount = (itemTotal * item.vatRate) / 100;
      
      subtotal += itemTotal;
      totalVAT += vatAmount;
      
      return {
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        vatRate: item.vatRate,
        total: itemTotal + vatAmount,
      };
    });

    const totalAmount = subtotal + totalVAT;

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber(companyId);

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        companyId,
        clientId,
        invoiceNumber,
        amount: subtotal,
        vatAmount: totalVAT,
        totalAmount,
        currency,
        dueDate: new Date(dueDate),
        notes,
        terms,
        createdById: req.user!.id,
        items: {
          create: processedItems,
        },
      },
      include: {
        client: true,
        items: true,
        company: true,
      },
    });

    // Log the creation
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE',
        tableName: 'invoices',
        recordId: invoice.id,
        newValues: invoice,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      },
    });

    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all invoices
export const getInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status, clientId, search } = req.query;
    const companyId = req.user!.companyId;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { companyId };

    if (status && status !== 'all') {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search as string, mode: 'insensitive' } },
        { client: { name: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          items: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.invoice.count({ where }),
    ]);

    // Calculate outstanding amounts
    const invoicesWithOutstanding = invoices.map((invoice) => {
      const paidAmount = invoice.payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
      );
      return {
        ...invoice,
        paidAmount,
        outstandingAmount: Number(invoice.totalAmount) - paidAmount,
      };
    });

    res.json({
      invoices: invoicesWithOutstanding,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single invoice
export const getInvoice = [
  param('id').isString(),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const companyId = req.user!.companyId;

      const invoice = await prisma.invoice.findFirst({
        where: { id, companyId },
        include: {
          client: true,
          items: true,
          payments: true,
          company: true,
          createdBy: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      const paidAmount = invoice.payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
      );

      res.json({
        ...invoice,
        paidAmount,
        outstandingAmount: Number(invoice.totalAmount) - paidAmount,
      });
    } catch (error) {
      console.error('Get invoice error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

// Update invoice
export const updateInvoice = [
  param('id').isString(),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status, notes, terms } = req.body;
      const companyId = req.user!.companyId;

      const existingInvoice = await prisma.invoice.findFirst({
        where: { id, companyId },
      });

      if (!existingInvoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      const updatedInvoice = await prisma.invoice.update({
        where: { id },
        data: {
          status,
          notes,
          terms,
          updatedAt: new Date(),
        },
        include: {
          client: true,
          items: true,
        },
      });

      // Log the update
      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'UPDATE',
          tableName: 'invoices',
          recordId: id,
          oldValues: existingInvoice,
          newValues: updatedInvoice,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
        },
      });

      res.json({ message: 'Invoice updated successfully', invoice: updatedInvoice });
    } catch (error) {
      console.error('Update invoice error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

// Record payment
export const recordPayment = [
  param('id').isString(),
  body('amount').isFloat({ gt: 0 }),
  body('paymentMethod').isIn(['CASH', 'CHEQUE', 'BANK_TRANSFER', 'CARD', 'ONLINE', 'PDC']),
  body('paymentDate').optional().isISO8601(),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { amount, paymentMethod, paymentDate, reference, notes } = req.body;
      const companyId = req.user!.companyId;

      const invoice = await prisma.invoice.findFirst({
        where: { id, companyId },
        include: { payments: true },
      });

      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      const paidAmount = invoice.payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
      );
      const outstandingAmount = Number(invoice.totalAmount) - paidAmount;

      if (amount > outstandingAmount) {
        return res.status(400).json({ 
          message: 'Payment amount cannot exceed outstanding amount' 
        });
      }

      // Record payment
      const payment = await prisma.invoicePayment.create({
        data: {
          invoiceId: id,
          amount,
          paymentMethod,
          paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
          reference,
          notes,
        },
      });

      // Update invoice status if fully paid
      const newOutstanding = outstandingAmount - amount;
      if (newOutstanding === 0) {
        await prisma.invoice.update({
          where: { id },
          data: { 
            status: 'PAID',
            paidDate: new Date(),
          },
        });
      }

      // Log the payment
      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'PAYMENT_RECORDED',
          tableName: 'invoice_payments',
          recordId: payment.id,
          newValues: payment,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
        },
      });

      res.json({ message: 'Payment recorded successfully', payment });
    } catch (error) {
      console.error('Record payment error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

// Generate PDF
export const generateInvoicePDF = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = req.user!.companyId;

    const invoice = await prisma.invoice.findFirst({
      where: { id, companyId },
      include: {
        client: true,
        items: true,
        company: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Header
    doc.fontSize(20).text(invoice.company.name, 50, 50);
    doc.fontSize(12).text(invoice.company.address, 50, 80);
    doc.text(`VAT No: ${invoice.company.vatNumber}`, 50, 100);

    // Invoice details
    doc.fontSize(24).text('INVOICE', 400, 50);
    doc.fontSize(12).text(`Invoice #: ${invoice.invoiceNumber}`, 400, 80);
    doc.text(`Date: ${invoice.issueDate.toLocaleDateString()}`, 400, 100);
    doc.text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`, 400, 120);

    // Client details
    doc.text('Bill To:', 50, 150);
    doc.text(invoice.client.name, 50, 170);
    doc.text(invoice.client.address, 50, 190);
    if (invoice.client.vatNumber) {
      doc.text(`VAT No: ${invoice.client.vatNumber}`, 50, 210);
    }

    // Line items table
    let yPosition = 250;
    
    // Table headers
    doc.rect(50, yPosition, 500, 25).fill('#f0f0f0');
    doc.fillColor('black').text('Description', 60, yPosition + 8);
    doc.text('Qty', 300, yPosition + 8);
    doc.text('Rate', 350, yPosition + 8);
    doc.text('VAT%', 400, yPosition + 8);
    doc.text('Amount', 450, yPosition + 8);
    
    yPosition += 25;

    // Items
    invoice.items.forEach((item) => {
      doc.text(item.description, 60, yPosition + 8);
      doc.text(item.quantity.toString(), 300, yPosition + 8);
      doc.text(`${invoice.currency} ${Number(item.unitPrice).toFixed(2)}`, 350, yPosition + 8);
      doc.text(`${Number(item.vatRate).toFixed(0)}%`, 400, yPosition + 8);
      doc.text(`${invoice.currency} ${Number(item.total).toFixed(2)}`, 450, yPosition + 8);
      yPosition += 25;
    });

    // Totals
    yPosition += 20;
    doc.text(`Subtotal: ${invoice.currency} ${Number(invoice.amount).toFixed(2)}`, 350, yPosition);
    yPosition += 20;
    doc.text(`VAT: ${invoice.currency} ${Number(invoice.vatAmount).toFixed(2)}`, 350, yPosition);
    yPosition += 20;
    doc.fontSize(14).text(`Total: ${invoice.currency} ${Number(invoice.totalAmount).toFixed(2)}`, 350, yPosition);

    // Notes
    if (invoice.notes) {
      yPosition += 40;
      doc.fontSize(12).text('Notes:', 50, yPosition);
      doc.text(invoice.notes, 50, yPosition + 20);
    }

    // Terms
    if (invoice.terms) {
      yPosition += 60;
      doc.text('Terms & Conditions:', 50, yPosition);
      doc.text(invoice.terms, 50, yPosition + 20);
    }

    doc.end();
  } catch (error) {
    console.error('Generate PDF error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send invoice by email
export const sendInvoiceEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;
    const companyId = req.user!.companyId;

    const invoice = await prisma.invoice.findFirst({
      where: { id, companyId },
      include: {
        client: true,
        company: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Create email transporter (configure with your SMTP settings)
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `${invoice.company.name} <${process.env.SMTP_FROM}>`,
      to: invoice.client.email,
      subject: subject || `Invoice ${invoice.invoiceNumber}`,
      html: `
        <h2>Invoice ${invoice.invoiceNumber}</h2>
        <p>Dear ${invoice.client.name},</p>
        <p>${message || 'Please find attached your invoice.'}</p>
        <p>
          <strong>Invoice Amount:</strong> ${invoice.currency} ${Number(invoice.totalAmount).toFixed(2)}<br>
          <strong>Due Date:</strong> ${invoice.dueDate.toLocaleDateString()}
        </p>
        <p>Thank you for your business!</p>
        <p>
          Best regards,<br>
          ${invoice.company.name}
        </p>
      `,
    });

    // Update invoice status
    await prisma.invoice.update({
      where: { id },
      data: { status: 'SENT' },
    });

    res.json({ message: 'Invoice sent successfully' });
  } catch (error) {
    console.error('Send invoice email error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get invoice analytics
export const getInvoiceAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const { period = 'month' } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case 'week':
        dateFilter = {
          issueDate: {
            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        };
        break;
      case 'month':
        dateFilter = {
          issueDate: {
            gte: new Date(now.getFullYear(), now.getMonth(), 1),
          },
        };
        break;
      case 'year':
        dateFilter = {
          issueDate: {
            gte: new Date(now.getFullYear(), 0, 1),
          },
        };
        break;
    }

    const [totalInvoices, totalRevenue, paidInvoices, overdueInvoices] = await Promise.all([
      prisma.invoice.count({
        where: { companyId, ...dateFilter },
      }),
      prisma.invoice.aggregate({
        where: { companyId, ...dateFilter },
        _sum: { totalAmount: true },
      }),
      prisma.invoice.count({
        where: { companyId, status: 'PAID', ...dateFilter },
      }),
      prisma.invoice.count({
        where: { 
          companyId, 
          status: { in: ['PENDING', 'SENT'] },
          dueDate: { lt: new Date() },
        },
      }),
    ]);

    res.json({
      totalInvoices,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      paidInvoices,
      overdueInvoices,
      paymentRate: totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0,
    });
  } catch (error) {
    console.error('Get invoice analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};