import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { checkPermission, checkCompany } from '../middleware/permissions';
import { NotFoundError } from '../types/errors';

const router = Router();
const prisma = new PrismaClient();

// Get all purchases
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Get first company if no user is authenticated (for testing)
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
        { poNumber: { contains: String(search), mode: 'insensitive' } },
        { notes: { contains: String(search), mode: 'insensitive' } },
        { supplier: { name: { contains: String(search), mode: 'insensitive' } } },
      ];
    }

    // Status filter
    if (status) {
      where.status = String(status).toUpperCase();
    }

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        skip,
        take,
        orderBy: { [String(sortBy)]: String(sortOrder) },
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              country: true,
            },
          },
          items: true,
        },
      }),
      prisma.purchase.count({ where }),
    ]);

    res.json({
      purchases,
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

// Get single purchase
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: req.params.id },
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    if (!purchase) {
      throw new NotFoundError('Purchase order not found');
    }

    res.json(purchase);
  } catch (error) {
    next(error);
  }
});

// Create purchase
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { supplier, poNumber, poDate, expectedDate, currency, items, notes, terms, status } = req.body;

    // Get company
    let companyId = req.user?.companyId;
    if (!companyId) {
      const firstCompany = await prisma.company.findFirst();
      companyId = firstCompany?.id;
    }

    if (!companyId) {
      return res.status(400).json({ error: 'Company not found' });
    }

    // Find or create supplier
    let supplierRecord = await prisma.supplier.findFirst({
      where: {
        companyId,
        name: { equals: supplier, mode: 'insensitive' },
      },
    });

    if (!supplierRecord) {
      supplierRecord = await prisma.supplier.create({
        data: {
          companyId,
          name: supplier,
          code: `SUP-${Date.now()}`,
          currency: currency || 'USD',
        },
      });
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0
    );
    const taxAmount = subtotal * 0; // No tax for purchases by default
    const totalAmount = subtotal + taxAmount;

    // Create purchase
    const purchase = await prisma.purchase.create({
      data: {
        companyId,
        supplierId: supplierRecord.id,
        poNumber: poNumber || `PO-${Date.now()}`,
        poDate: poDate ? new Date(poDate) : new Date(),
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        currency: currency || 'USD',
        subtotal,
        taxAmount,
        totalAmount,
        status: status || 'PENDING',
        notes,
        terms,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            totalPrice: parseFloat(item.quantity) * parseFloat(item.unitPrice),
          })),
        },
      },
      include: {
        supplier: true,
        items: true,
      },
    });

    res.status(201).json(purchase);
  } catch (error) {
    next(error);
  }
});

// Update purchase
router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { status, notes, terms, items } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (terms !== undefined) updateData.terms = terms;

    if (items && items.length > 0) {
      // Delete existing items and create new ones
      await prisma.purchaseItem.deleteMany({
        where: { purchaseId: req.params.id },
      });

      const subtotal = items.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0
      );
      const taxAmount = 0;
      const totalAmount = subtotal + taxAmount;

      updateData.subtotal = subtotal;
      updateData.taxAmount = taxAmount;
      updateData.totalAmount = totalAmount;
      updateData.items = {
        create: items.map((item: any) => ({
          description: item.description,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          totalPrice: parseFloat(item.quantity) * parseFloat(item.unitPrice),
        })),
      };
    }

    const purchase = await prisma.purchase.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        supplier: true,
        items: true,
      },
    });

    res.json(purchase);
  } catch (error) {
    next(error);
  }
});

// Delete purchase
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    await prisma.purchase.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get purchase statistics
router.get('/stats/summary', async (req: AuthRequest, res, next) => {
  try {
    let companyId = req.user?.companyId;
    if (!companyId) {
      const firstCompany = await prisma.company.findFirst();
      companyId = firstCompany?.id;
    }

    const [total, pending, confirmed, received] = await Promise.all([
      prisma.purchase.count({ where: { companyId } }),
      prisma.purchase.count({ where: { companyId, status: 'PENDING' } }),
      prisma.purchase.count({ where: { companyId, status: 'CONFIRMED' } }),
      prisma.purchase.count({ where: { companyId, status: 'RECEIVED' } }),
    ]);

    const totalAmount = await prisma.purchase.aggregate({
      where: { companyId },
      _sum: { totalAmount: true },
    });

    res.json({
      total,
      pending,
      confirmed,
      received,
      totalAmount: totalAmount._sum.totalAmount || 0,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
