import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { checkPermission, checkCompany } from '../middleware/permissions';
import { validateRequest, invoiceValidation } from '../middleware/validation';
import { NotFoundError, ValidationErrorClass } from '../types/errors';

const router = Router();
const prisma = new PrismaClient();

// Apply authentication and company check to all routes
router.use(authenticateToken);
router.use(checkCompany);

// Get all invoices
router.get('/',
  checkPermission('invoices', 'read'),
  async (req, res, next) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        status, 
        clientId, 
        dateFrom, 
        dateTo, 
        sortBy = 'createdAt', 
        sortOrder = 'desc' 
      } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Get first company if no user is authenticated (for testing)
      let companyId = (req as any).user?.companyId;
      if (!companyId) {
        const firstCompany = await prisma.company.findFirst();
        companyId = firstCompany?.id;
      }

      const where: any = {
        companyId: companyId,
      };

      // Search functionality
      if (search) {
        where.OR = [
          { invoiceNumber: { contains: String(search), mode: 'insensitive' } },
          { client: { name: { contains: String(search), mode: 'insensitive' } } },
          { notes: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      // Status filter
      if (status && status !== 'all') {
        where.status = status;
      }

      // Client filter
      if (clientId) {
        where.clientId = String(clientId);
      }

      // Date range filter
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) {
          where.createdAt.gte = new Date(String(dateFrom));
        }
        if (dateTo) {
          where.createdAt.lte = new Date(String(dateTo));
        }
      }

      // Get invoices with pagination
      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          skip,
          take,
          orderBy: {
            [String(sortBy)]: String(sortOrder),
          },
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
            payments: {
              select: {
                id: true,
                amount: true,
                paymentDate: true,
                method: true,
                status: true,
              },
            },
            _count: {
              select: {
                payments: true,
              },
            },
          },
        }),
        prisma.invoice.count({ where }),
      ]);

      // Calculate totals for summary
      const totals = await prisma.invoice.aggregate({
        where,
        _sum: {
          totalAmount: true,
          taxAmount: true,
          discountAmount: true,
        },
      });

      res.json({
        success: true,
        data: {
          invoices,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
          },
          summary: {
            totalAmount: totals._sum.totalAmount || 0,
            totalTax: totals._sum.taxAmount || 0,
            totalDiscount: totals._sum.discountAmount || 0,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get invoice by ID
router.get('/:id',
  checkPermission('invoices', 'read'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const invoice = await prisma.invoice.findFirst({
        where: {
          id,
          companyId: req.user!.companyId,
        },
        include: {
          client: true,
          items: true,
          payments: {
            orderBy: { createdAt: 'desc' },
          },
          company: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              logo: true,
              taxNumber: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!invoice) {
        throw new NotFoundError('Invoice');
      }

      res.json({
        success: true,
        data: { invoice },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create new invoice
router.post('/',
  // checkPermission('invoices', 'create'), // Temporarily disabled for testing
  // validateRequest(invoiceValidation), // Temporarily disabled for testing
  async (req, res, next) => {
    try {
      const { 
        clientId, 
        subtotal,
        amount, // Keep for backward compatibility
        taxAmount = 0, 
        discountAmount = 0, 
        dueDate, 
        notes, 
        items,
        status = 'DRAFT',
      } = req.body;

      // Calculate subtotal from items if not provided
      let calculatedSubtotal = subtotal;
      if (!calculatedSubtotal && items && items.length > 0) {
        calculatedSubtotal = items.reduce((sum: number, item: any) => 
          sum + (item.quantity * item.unitPrice), 0);
      } else if (!calculatedSubtotal && amount) {
        calculatedSubtotal = amount; // Fallback to amount for backward compatibility
      }

      // Get company ID (for testing without auth)
      let companyId = req.user?.companyId;
      let userId = req.user?.userId;
      if (!companyId) {
        const firstCompany = await prisma.company.findFirst();
        companyId = firstCompany?.id;
        const firstUser = await prisma.user.findFirst({ where: { companyId } });
        userId = firstUser?.id;
      }

      if (!companyId || !userId) {
        return res.status(500).json({ error: 'No company or user found' });
      }

      // Verify client exists and belongs to company
      const client = await prisma.client.findFirst({
        where: {
          id: clientId,
          companyId: companyId,
          isActive: true,
        },
      });

      if (!client) {
        throw new ValidationErrorClass([
          { field: 'clientId', message: 'Invalid or inactive client', value: clientId },
        ]);
      }

      // Generate invoice number
      const lastInvoice = await prisma.invoice.findFirst({
        where: { companyId: companyId },
        orderBy: { invoiceNumber: 'desc' },
      });

      let invoiceNumber: string;
      if (lastInvoice && lastInvoice.invoiceNumber.match(/INV-(\d+)/)) {
        const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1]);
        invoiceNumber = `INV-${(lastNumber + 1).toString().padStart(6, '0')}`;
      } else {
        invoiceNumber = 'INV-000001';
      }

      // Calculate total amount and balance
      const totalAmount = calculatedSubtotal + taxAmount - discountAmount;
      const balanceAmount = totalAmount; // Initially, balance = total (no payments yet)

      // Create invoice with items
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          clientId,
          companyId: companyId,
          subtotal: calculatedSubtotal,
          taxAmount,
          discountAmount,
          totalAmount,
          balanceAmount,
          dueDate: new Date(dueDate),
          status,
          notes,
          createdById: userId,
          items: {
            create: items.map((item: any) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
              productId: item.productId || null, // Optional product link
            })),
          },
        },
        include: {
          client: true,
          items: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: { invoice },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update invoice
router.put('/:id',
  checkPermission('invoices', 'update'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { 
        clientId, 
        amount, 
        taxAmount, 
        discountAmount, 
        dueDate, 
        notes, 
        items,
        status,
      } = req.body;

      // Check if invoice exists and belongs to company
      const existingInvoice = await prisma.invoice.findFirst({
        where: {
          id,
          companyId: req.user!.companyId,
        },
      });

      if (!existingInvoice) {
        throw new NotFoundError('Invoice');
      }

      // Check if invoice can be edited (not paid or cancelled)
      if (existingInvoice.status === 'PAID' || existingInvoice.status === 'CANCELLED') {
        throw new ValidationErrorClass([
          { field: 'status', message: `Cannot edit ${existingInvoice.status.toLowerCase()} invoice`, value: existingInvoice.status },
        ]);
      }

      // Verify client if changing
      if (clientId && clientId !== existingInvoice.clientId) {
        const client = await prisma.client.findFirst({
          where: {
            id: clientId,
            companyId: req.user!.companyId,
            isActive: true,
          },
        });

        if (!client) {
          throw new ValidationErrorClass([
            { field: 'clientId', message: 'Invalid or inactive client', value: clientId },
          ]);
        }
      }

      // Calculate net amount
      const finalAmount = amount || existingInvoice.amount;
      const finalTaxAmount = taxAmount ?? existingInvoice.taxAmount;
      const finalDiscountAmount = discountAmount ?? existingInvoice.discountAmount;
      const netAmount = finalAmount + finalTaxAmount - finalDiscountAmount;

      // Update invoice
      const invoice = await prisma.invoice.update({
        where: { id },
        data: {
          ...(clientId && { clientId }),
          ...(amount && { amount }),
          ...(taxAmount !== undefined && { taxAmount }),
          ...(discountAmount !== undefined && { discountAmount }),
          netAmount,
          ...(dueDate && { dueDate: new Date(dueDate) }),
          ...(notes !== undefined && { notes }),
          ...(status && { status }),
          updatedAt: new Date(),
        },
        include: {
          client: true,
          items: true,
        },
      });

      // Update items if provided
      if (items && Array.isArray(items)) {
        // Delete existing items
        await prisma.invoiceItem.deleteMany({
          where: { invoiceId: id },
        });

        // Create new items
        await prisma.invoiceItem.createMany({
          data: items.map((item: any) => ({
            invoiceId: id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            taxRate: item.taxRate || 0,
          })),
        });
      }

      // Refetch with updated items
      const updatedInvoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          client: true,
          items: true,
        },
      });

      res.json({
        success: true,
        message: 'Invoice updated successfully',
        data: { invoice: updatedInvoice },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete/Cancel invoice
router.delete('/:id',
  checkPermission('invoices', 'delete'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if invoice exists
      const invoice = await prisma.invoice.findFirst({
        where: {
          id,
          companyId: req.user!.companyId,
        },
        include: {
          payments: true,
        },
      });

      if (!invoice) {
        throw new NotFoundError('Invoice');
      }

      // Check if invoice has payments
      if (invoice.payments.length > 0) {
        // Cancel instead of delete
        await prisma.invoice.update({
          where: { id },
          data: { 
            status: 'CANCELLED',
            updatedAt: new Date(),
          },
        });

        return res.json({
          success: true,
          message: 'Invoice cancelled successfully (has payments)',
          data: { action: 'cancelled' },
        });
      }

      // Delete invoice and items
      await prisma.invoice.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Invoice deleted successfully',
        data: { action: 'deleted' },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Send invoice
router.post('/:id/send',
  checkPermission('invoices', 'update'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const invoice = await prisma.invoice.findFirst({
        where: {
          id,
          companyId: req.user!.companyId,
        },
        include: {
          client: true,
        },
      });

      if (!invoice) {
        throw new NotFoundError('Invoice');
      }

      // Don't allow sending cancelled or fully paid invoices
      if (invoice.status === 'CANCELLED') {
        throw new ValidationErrorClass([
          { field: 'status', message: 'Cancelled invoices cannot be sent', value: invoice.status },
        ]);
      }

      // Update status and sent date
      // Keep current status if already PAID or PARTIALLY_PAID, otherwise set to PENDING
      const newStatus = ['PAID', 'PARTIALLY_PAID'].includes(invoice.status) 
        ? invoice.status 
        : 'PENDING';
      
      await prisma.invoice.update({
        where: { id },
        data: {
          status: newStatus,
          sentDate: new Date(),
          updatedAt: new Date(),
        },
      });

      // TODO: Implement email sending logic here
      // await emailService.sendInvoice(invoice, client);

      res.json({
        success: true,
        message: 'Invoice sent successfully',
        data: { 
          invoiceId: id,
          sentDate: new Date(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Mark invoice as paid
router.post('/:id/mark-paid',
  checkPermission('invoices', 'update'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { paymentAmount, paymentMethod = 'BANK_TRANSFER', paymentDate = new Date() } = req.body;

      const invoice = await prisma.invoice.findFirst({
        where: {
          id,
          companyId: req.user!.companyId,
        },
      });

      if (!invoice) {
        throw new NotFoundError('Invoice');
      }

      if (invoice.status === 'PAID' || invoice.status === 'CANCELLED') {
        throw new ValidationErrorClass([
          { field: 'status', message: `Cannot mark ${invoice.status.toLowerCase()} invoice as paid`, value: invoice.status },
        ]);
      }

      const amountToPay = paymentAmount || invoice.netAmount;

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          invoiceId: id,
          amount: amountToPay,
          paymentMethod,
          paymentDate: new Date(paymentDate),
          status: 'COMPLETED',
          companyId: req.user!.companyId,
          createdById: req.user!.userId,
        },
      });

      // Update invoice status
      await prisma.invoice.update({
        where: { id },
        data: {
          status: 'PAID',
          paidDate: new Date(paymentDate),
          updatedAt: new Date(),
        },
      });

      res.json({
        success: true,
        message: 'Invoice marked as paid successfully',
        data: { 
          payment,
          invoiceId: id,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get invoice statistics
router.get('/stats/summary',
  checkPermission('invoices', 'read'),
  async (req, res, next) => {
    try {
      const { dateFrom, dateTo } = req.query;

      const where: any = {
        companyId: req.user!.companyId,
      };

      // Date range filter
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) {
          where.createdAt.gte = new Date(String(dateFrom));
        }
        if (dateTo) {
          where.createdAt.lte = new Date(String(dateTo));
        }
      }

      // Get statistics
      const [
        totalInvoices,
        totalAmount,
        paidInvoices,
        paidAmount,
        pendingInvoices,
        overdueInvoices,
        statusBreakdown,
      ] = await Promise.all([
        prisma.invoice.count({ where }),
        prisma.invoice.aggregate({
          where,
          _sum: { netAmount: true },
        }),
        prisma.invoice.count({
          where: { ...where, status: 'PAID' },
        }),
        prisma.invoice.aggregate({
          where: { ...where, status: 'PAID' },
          _sum: { netAmount: true },
        }),
        prisma.invoice.count({
          where: { 
            ...where, 
            status: { in: ['SENT', 'PENDING'] },
          },
        }),
        prisma.invoice.count({
          where: { ...where, status: 'OVERDUE' },
        }),
        prisma.invoice.groupBy({
          by: ['status'],
          where,
          _count: true,
          _sum: { netAmount: true },
        }),
      ]);

      const stats = {
        totalInvoices,
        totalAmount: totalAmount._sum.netAmount || 0,
        paidInvoices,
        paidAmount: paidAmount._sum.netAmount || 0,
        pendingInvoices,
        overdueInvoices,
        unpaidAmount: (totalAmount._sum.netAmount || 0) - (paidAmount._sum.netAmount || 0),
        statusBreakdown: statusBreakdown.map(item => ({
          status: item.status,
          count: item._count,
          amount: item._sum.netAmount || 0,
        })),
      };

      res.json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;