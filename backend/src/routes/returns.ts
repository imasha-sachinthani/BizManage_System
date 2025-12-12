import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { NotFoundError } from '../types/errors';

const router = Router();
const prisma = new PrismaClient();

// Get all returns
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10, search, type, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { returnNumber: { contains: String(search), mode: 'insensitive' } },
        { reason: { contains: String(search), mode: 'insensitive' } },
        { notes: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (type) where.type = String(type).toUpperCase().replace(/-/g, '_');
    if (status) where.status = String(status).toUpperCase();

    const [returns, total] = await Promise.all([
      prisma.return.findMany({
        where,
        skip,
        take,
        orderBy: { [String(sortBy)]: String(sortOrder) },
        include: {
          items: true,
        },
      }),
      prisma.return.count({ where }),
    ]);

    res.json({
      returns,
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

// Get single return
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const returnRecord = await prisma.return.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
      },
    });

    if (!returnRecord) {
      throw new NotFoundError('Return not found');
    }

    res.json(returnRecord);
  } catch (error) {
    next(error);
  }
});

// Create return
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { 
      returnNumber,
      returnDate,
      type,
      invoiceId,
      purchaseId,
      reason,
      status,
      refundAmount,
      creditNoteNo,
      creditNoteDate,
      notes,
      items
    } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => 
      sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0
    );

    const returnRecord = await prisma.return.create({
      data: {
        returnNumber: returnNumber || `RET-${Date.now()}`,
        returnDate: returnDate ? new Date(returnDate) : new Date(),
        type: type || 'SALES_RETURN',
        invoiceId: invoiceId || null,
        purchaseId: purchaseId || null,
        reason: reason || 'Product issue',
        status: status || 'PENDING',
        totalAmount,
        refundAmount: refundAmount ? parseFloat(refundAmount) : 0,
        creditNoteNo,
        creditNoteDate: creditNoteDate ? new Date(creditNoteDate) : null,
        notes,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            totalPrice: parseFloat(item.quantity) * parseFloat(item.unitPrice),
            productId: item.productId || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json(returnRecord);
  } catch (error) {
    next(error);
  }
});

// Update return
router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { status, refundAmount, creditNoteNo, creditNoteDate, notes, items } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (refundAmount !== undefined) updateData.refundAmount = parseFloat(refundAmount);
    if (creditNoteNo !== undefined) updateData.creditNoteNo = creditNoteNo;
    if (creditNoteDate) updateData.creditNoteDate = new Date(creditNoteDate);
    if (notes !== undefined) updateData.notes = notes;

    if (items && items.length > 0) {
      await prisma.returnItem.deleteMany({
        where: { returnId: req.params.id },
      });

      const totalAmount = items.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0
      );

      updateData.totalAmount = totalAmount;
      updateData.items = {
        create: items.map((item: any) => ({
          description: item.description,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          totalPrice: parseFloat(item.quantity) * parseFloat(item.unitPrice),
          productId: item.productId || null,
        })),
      };
    }

    const returnRecord = await prisma.return.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        items: true,
      },
    });

    res.json(returnRecord);
  } catch (error) {
    next(error);
  }
});

// Delete return
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    await prisma.return.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Return deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Approve return
router.post('/:id/approve', async (req: AuthRequest, res, next) => {
  try {
    const { refundAmount } = req.body;

    const returnRecord = await prisma.return.update({
      where: { id: req.params.id },
      data: {
        status: 'APPROVED',
        refundAmount: refundAmount ? parseFloat(refundAmount) : undefined,
      },
      include: {
        items: true,
      },
    });

    res.json(returnRecord);
  } catch (error) {
    next(error);
  }
});

// Reject return
router.post('/:id/reject', async (req: AuthRequest, res, next) => {
  try {
    const { notes } = req.body;

    const returnRecord = await prisma.return.update({
      where: { id: req.params.id },
      data: {
        status: 'REJECTED',
        notes: notes || undefined,
      },
      include: {
        items: true,
      },
    });

    res.json(returnRecord);
  } catch (error) {
    next(error);
  }
});

// Get return statistics
router.get('/stats/summary', async (req: AuthRequest, res, next) => {
  try {
    const [total, pending, approved, salesReturns, purchaseReturns] = await Promise.all([
      prisma.return.count(),
      prisma.return.count({ where: { status: 'PENDING' } }),
      prisma.return.count({ where: { status: 'APPROVED' } }),
      prisma.return.count({ where: { type: 'SALES_RETURN' } }),
      prisma.return.count({ where: { type: 'PURCHASE_RETURN' } }),
    ]);

    const totalAmount = await prisma.return.aggregate({
      _sum: { totalAmount: true, refundAmount: true },
    });

    res.json({
      total,
      pending,
      approved,
      salesReturns,
      purchaseReturns,
      totalReturnAmount: totalAmount._sum.totalAmount || 0,
      totalRefundAmount: totalAmount._sum.refundAmount || 0,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
