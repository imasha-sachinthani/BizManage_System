import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { NotFoundError } from '../types/errors';

const router = Router();
const prisma = new PrismaClient();

// Get all tenders
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { tenderNumber: { contains: String(search), mode: 'insensitive' } },
        { title: { contains: String(search), mode: 'insensitive' } },
        { clientName: { contains: String(search), mode: 'insensitive' } },
        { notes: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (status) where.status = String(status).toUpperCase().replace(/-/g, '_');

    const [tenders, total] = await Promise.all([
      prisma.tender.findMany({
        where,
        skip,
        take,
        orderBy: { [String(sortBy)]: String(sortOrder) },
        include: {
          documents: true,
        },
      }),
      prisma.tender.count({ where }),
    ]);

    res.json({
      tenders,
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

// Get single tender
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const tender = await prisma.tender.findUnique({
      where: { id: req.params.id },
      include: {
        documents: true,
      },
    });

    if (!tender) {
      throw new NotFoundError('Tender not found');
    }

    res.json(tender);
  } catch (error) {
    next(error);
  }
});

// Create tender
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { 
      tenderNumber,
      title,
      clientName,
      submissionDate,
      openingDate,
      validityDate,
      bidSecurityReq,
      bidSecAmount,
      bidSecType,
      bidSecBankRef,
      bidSecIssueDate,
      bidSecExpiryDate,
      bidSecBank,
      perfSecurityReq,
      perfSecAmount,
      perfSecType,
      perfSecBankRef,
      perfSecIssueDate,
      perfSecExpiryDate,
      perfSecBank,
      estimatedValue,
      quotedValue,
      status,
      notes
    } = req.body;

    const tender = await prisma.tender.create({
      data: {
        tenderNumber: tenderNumber || `TND-${Date.now()}`,
        title: title || 'Untitled Tender',
        clientName: clientName || 'Unknown Client',
        submissionDate: submissionDate ? new Date(submissionDate) : new Date(),
        openingDate: openingDate ? new Date(openingDate) : null,
        validityDate: validityDate ? new Date(validityDate) : null,
        bidSecurityReq: bidSecurityReq || false,
        bidSecAmount: bidSecAmount ? parseFloat(bidSecAmount) : null,
        bidSecType,
        bidSecBankRef,
        bidSecIssueDate: bidSecIssueDate ? new Date(bidSecIssueDate) : null,
        bidSecExpiryDate: bidSecExpiryDate ? new Date(bidSecExpiryDate) : null,
        bidSecBank,
        perfSecurityReq: perfSecurityReq || false,
        perfSecAmount: perfSecAmount ? parseFloat(perfSecAmount) : null,
        perfSecType,
        perfSecBankRef,
        perfSecIssueDate: perfSecIssueDate ? new Date(perfSecIssueDate) : null,
        perfSecExpiryDate: perfSecExpiryDate ? new Date(perfSecExpiryDate) : null,
        perfSecBank,
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
        quotedValue: quotedValue ? parseFloat(quotedValue) : null,
        status: status || 'PREPARING',
        notes,
      },
      include: {
        documents: true,
      },
    });

    res.status(201).json(tender);
  } catch (error) {
    next(error);
  }
});

// Update tender
router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const updateData: any = { ...req.body };

    // Convert date strings to Date objects
    if (updateData.submissionDate) updateData.submissionDate = new Date(updateData.submissionDate);
    if (updateData.openingDate) updateData.openingDate = new Date(updateData.openingDate);
    if (updateData.validityDate) updateData.validityDate = new Date(updateData.validityDate);
    if (updateData.bidSecIssueDate) updateData.bidSecIssueDate = new Date(updateData.bidSecIssueDate);
    if (updateData.bidSecExpiryDate) updateData.bidSecExpiryDate = new Date(updateData.bidSecExpiryDate);
    if (updateData.perfSecIssueDate) updateData.perfSecIssueDate = new Date(updateData.perfSecIssueDate);
    if (updateData.perfSecExpiryDate) updateData.perfSecExpiryDate = new Date(updateData.perfSecExpiryDate);

    // Convert numeric strings to numbers
    if (updateData.bidSecAmount) updateData.bidSecAmount = parseFloat(updateData.bidSecAmount);
    if (updateData.perfSecAmount) updateData.perfSecAmount = parseFloat(updateData.perfSecAmount);
    if (updateData.estimatedValue) updateData.estimatedValue = parseFloat(updateData.estimatedValue);
    if (updateData.quotedValue) updateData.quotedValue = parseFloat(updateData.quotedValue);

    const tender = await prisma.tender.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        documents: true,
      },
    });

    res.json(tender);
  } catch (error) {
    next(error);
  }
});

// Delete tender
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    await prisma.tender.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Tender deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Update tender status
router.patch('/:id/status', async (req: AuthRequest, res, next) => {
  try {
    const { status } = req.body;

    const tender = await prisma.tender.update({
      where: { id: req.params.id },
      data: { status: status.toUpperCase().replace(/-/g, '_') },
      include: {
        documents: true,
      },
    });

    res.json(tender);
  } catch (error) {
    next(error);
  }
});

// Get tender statistics
router.get('/stats/summary', async (req: AuthRequest, res, next) => {
  try {
    const [total, preparing, submitted, underEvaluation, won, lost] = await Promise.all([
      prisma.tender.count(),
      prisma.tender.count({ where: { status: 'PREPARING' } }),
      prisma.tender.count({ where: { status: 'SUBMITTED' } }),
      prisma.tender.count({ where: { status: 'UNDER_EVALUATION' } }),
      prisma.tender.count({ where: { status: 'WON' } }),
      prisma.tender.count({ where: { status: 'LOST' } }),
    ]);

    const values = await prisma.tender.aggregate({
      _sum: { estimatedValue: true, quotedValue: true },
    });

    res.json({
      total,
      preparing,
      submitted,
      underEvaluation,
      won,
      lost,
      totalEstimatedValue: values._sum.estimatedValue || 0,
      totalQuotedValue: values._sum.quotedValue || 0,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
