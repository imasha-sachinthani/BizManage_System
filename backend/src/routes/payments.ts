import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { NotFoundError } from '../types/errors';

const router = Router();
const prisma = new PrismaClient();

// Get all payments
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10, search, type, method, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    let companyId = req.user?.companyId;
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
        { paymentNumber: { contains: String(search), mode: 'insensitive' } },
        { reference: { contains: String(search), mode: 'insensitive' } },
        { notes: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    // Filters
    if (type) where.type = String(type).toUpperCase();
    if (method) where.method = String(method).toUpperCase();
    if (status) where.status = String(status).toUpperCase();

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take,
        orderBy: { [String(sortBy)]: String(sortOrder) },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          supplier: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
            },
          },
          purchase: {
            select: {
              id: true,
              poNumber: true,
            },
          },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      payments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single payment
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: {
        client: true,
        supplier: true,
        invoice: true,
        purchase: true,
      },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    res.json(payment);
  } catch (error) {
    next(error);
  }
});

// Create payment
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { 
      paymentNumber, 
      paymentDate, 
      amount, 
      type, 
      method, 
      clientId, 
      supplierId, 
      invoiceId, 
      purchaseId,
      reference,
      bankAccount,
      notes,
      status
    } = req.body;

    let companyId = req.user?.companyId;
    if (!companyId) {
      const firstCompany = await prisma.company.findFirst();
      companyId = firstCompany?.id;
    }

    if (!companyId) {
      return res.status(400).json({ error: 'Company not found' });
    }

    const payment = await prisma.payment.create({
      data: {
        companyId,
        paymentNumber: paymentNumber || `PAY-${Date.now()}`,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        amount: parseFloat(amount),
        type: type || 'RECEIVED',
        method: method || 'CASH',
        clientId: clientId || null,
        supplierId: supplierId || null,
        invoiceId: invoiceId || null,
        purchaseId: purchaseId || null,
        reference,
        bankAccount,
        notes,
        status: status || 'COMPLETED',
      },
      include: {
        client: true,
        supplier: true,
        invoice: true,
        purchase: true,
      },
    });

    // Update invoice status if payment is for an invoice
    if (invoiceId && type === 'RECEIVED') {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          payments: true,
        },
      });

      if (invoice) {
        const totalPaid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const invoiceTotal = Number(invoice.totalAmount);

        if (totalPaid >= invoiceTotal) {
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: 'PAID' },
          });
        } else if (totalPaid > 0) {
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: 'PARTIALLY_PAID' },
          });
        }
      }
    }

    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
});

// Update payment
router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { status, notes, reference, bankAccount } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (reference !== undefined) updateData.reference = reference;
    if (bankAccount !== undefined) updateData.bankAccount = bankAccount;

    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        client: true,
        supplier: true,
        invoice: true,
        purchase: true,
      },
    });

    res.json(payment);
  } catch (error) {
    next(error);
  }
});

// Delete payment
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    await prisma.payment.delete({
      where: { id: req.params.id },
    });

    // Recalculate invoice status if applicable
    if (payment.invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: payment.invoiceId },
        include: {
          payments: true,
        },
      });

      if (invoice) {
        const totalPaid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const invoiceTotal = Number(invoice.totalAmount);

        let newStatus = 'PENDING';
        if (totalPaid >= invoiceTotal) newStatus = 'PAID';
        else if (totalPaid > 0) newStatus = 'PARTIALLY_PAID';

        await prisma.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: newStatus as any },
        });
      }
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get payment statistics
router.get('/stats/summary', async (req: AuthRequest, res, next) => {
  try {
    let companyId = req.user?.companyId;
    if (!companyId) {
      const firstCompany = await prisma.company.findFirst();
      companyId = firstCompany?.id;
    }

    const [totalReceived, totalPaid, pendingPayments] = await Promise.all([
      prisma.payment.aggregate({
        where: { companyId, type: 'RECEIVED', status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { companyId, type: 'PAID', status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.payment.count({
        where: { companyId, status: 'PENDING' },
      }),
    ]);

    res.json({
      totalReceived: totalReceived._sum.amount || 0,
      totalPaid: totalPaid._sum.amount || 0,
      pendingPayments,
      netCashFlow: Number(totalReceived._sum.amount || 0) - Number(totalPaid._sum.amount || 0),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
