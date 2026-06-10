import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { checkPermission, checkCompany } from '../middleware/permissions';
import { validateRequest, clientValidation } from '../middleware/validation';
import { NotFoundError, ValidationErrorClass } from '../types/errors';

const router = Router();
const prisma = new PrismaClient();

// Apply authentication and company check to all routes
router.use(authenticateToken);
router.use(checkCompany);

// Get all clients
router.get('/', 
  checkPermission('clients', 'read'),
  async (req: AuthRequest, res, next) => {
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
          { name: { contains: String(search), mode: 'insensitive' } },
          { email: { contains: String(search), mode: 'insensitive' } },
          { phone: { contains: String(search), mode: 'insensitive' } },
          { mobile: { contains: String(search), mode: 'insensitive' } },
          { address: { contains: String(search), mode: 'insensitive' } },
          { taxId: { contains: String(search), mode: 'insensitive' } },
          { code: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      // Status filter
      if (status) {
        where.isActive = status === 'active';
      }

      // Get clients with pagination
      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          where,
          skip,
          take,
          orderBy: {
            [String(sortBy)]: String(sortOrder),
          },
          include: {
            _count: {
              select: {
                invoices: true,
                payments: true,
              },
            },
            contacts: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        }),
        prisma.client.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          clients,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get client by ID
router.get('/:id',
  checkPermission('clients', 'read'),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;

      const client = await prisma.client.findFirst({
        where: {
          id,
          companyId: req.user!.companyId,
        },
        include: {
          invoices: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              invoiceNumber: true,
              totalAmount: true,
              status: true,
              dueDate: true,
              createdAt: true,
            },
          },
          payments: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              amount: true,
              method: true,
              status: true,
              paymentDate: true,
            },
          },
          _count: {
            select: {
              invoices: true,
              payments: true,
            },
          },
          contacts: {
            orderBy: { isPrimary: 'desc' },
          },
        },
      });

      if (!client) {
        throw new NotFoundError('Client');
      }

      res.json({
        success: true,
        data: { client },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create new client
router.post('/',
  checkPermission('clients', 'create'),
  validateRequest(clientValidation),
  async (req: AuthRequest, res, next) => {
    try {
      const { 
        name, 
        email, 
        phone, 
        mobile,
        address, 
        city,
        country,
        taxId,
        creditLimit,
        paymentTerms,
        category,
        notes 
      } = req.body;

      // Get companyId from user or first company (for testing)
      let companyId = req.user?.companyId;
      if (!companyId) {
        const firstCompany = await prisma.company.findFirst();
        companyId = firstCompany?.id;
      }
      
      if (!companyId) {
        throw new ValidationErrorClass([
          { field: 'companyId', message: 'No company found. Please create a company first.' },
        ]);
      }
      
      // Check if client with same email exists in company
      if (email) {
        const existingClient = await prisma.client.findFirst({
          where: {
            email: email.toLowerCase(),
            companyId: companyId,
          },
        });

        if (existingClient) {
          throw new ValidationErrorClass([
            { field: 'email', message: 'Client with this email already exists', value: email },
          ]);
        }
      }

      // Generate client code
      const companyClients = await prisma.client.count({
        where: { companyId: companyId }
      });
      const clientCode = `CL${String(companyClients + 1).padStart(4, '0')}`;

      const client = await prisma.client.create({
        data: {
          code: clientCode,
          name,
          email: email?.toLowerCase() || null,
          phone: phone || null,
          mobile: mobile || null,
          address: address || null,
          city: city || null,
          country: country || null,
          taxId: taxId || null,
          creditLimit: creditLimit ? parseFloat(creditLimit) : 0,
          paymentTerms: paymentTerms ? parseInt(paymentTerms) : 30,
          category: (category as any) || 'REGULAR',
          notes: notes || null,
          companyId: companyId,
        },
        include: {
          _count: {
            select: {
              invoices: true,
              payments: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Client created successfully',
        data: { client },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update client
router.put('/:id',
  checkPermission('clients', 'update'),
  validateRequest(clientValidation.filter(rule => rule.field !== 'name')), // Name is optional for updates
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const { 
        name, 
        email, 
        phone,
        mobile, 
        address,
        city,
        country,
        taxId,
        creditLimit,
        paymentTerms,
        category,
        notes, 
        isActive 
      } = req.body;

      // Check if client exists
      const existingClient = await prisma.client.findFirst({
        where: {
          id,
          companyId: req.user!.companyId,
        },
      });

      if (!existingClient) {
        throw new NotFoundError('Client');
      }

      // Check if email is being changed and doesn't conflict
      if (email && email.toLowerCase() !== existingClient.email) {
        const emailExists = await prisma.client.findFirst({
          where: {
            email: email.toLowerCase(),
            companyId: req.user!.companyId,
            id: { not: id },
          },
        });

        if (emailExists) {
          throw new ValidationErrorClass([
            { field: 'email', message: 'Client with this email already exists', value: email },
          ]);
        }
      }

      const updateData: any = {
        updatedAt: new Date(),
      };

      if (name) updateData.name = name;
      if (email) updateData.email = email.toLowerCase();
      if (phone) updateData.phone = phone;
      if (mobile) updateData.mobile = mobile;
      if (address) updateData.address = address;
      if (city) updateData.city = city;
      if (country) updateData.country = country;
      if (taxId) updateData.taxId = taxId;
      if (creditLimit !== undefined) updateData.creditLimit = parseFloat(creditLimit);
      if (paymentTerms !== undefined) updateData.paymentTerms = parseInt(paymentTerms);
      if (category) updateData.category = category;
      if (notes !== undefined) updateData.notes = notes;
      if (isActive !== undefined) updateData.isActive = isActive;

      const client = await prisma.client.update({
        where: { id },
        data: updateData,
        include: {
          _count: {
            select: {
              invoices: true,
              payments: true,
            },
          },
        },
      });

      res.json({
        success: true,
        message: 'Client updated successfully',
        data: { client },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete client
router.delete('/:id',
  checkPermission('clients', 'delete'),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;

      // Check if client exists
      const client = await prisma.client.findFirst({
        where: {
          id,
          companyId: req.user!.companyId,
        },
        include: {
          _count: {
            select: {
              invoices: true,
              payments: true,
            },
          },
        },
      });

      if (!client) {
        throw new NotFoundError('Client');
      }

      // Check if client has invoices or payments
      if (client._count.invoices > 0 || client._count.payments > 0) {
        // Soft delete - deactivate instead of deleting
        await prisma.client.update({
          where: { id },
          data: { isActive: false, updatedAt: new Date() },
        });

        return res.json({
          success: true,
          message: 'Client deactivated successfully (has existing transactions)',
          data: { action: 'deactivated' },
        });
      }

      // Hard delete if no transactions
      await prisma.client.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Client deleted successfully',
        data: { action: 'deleted' },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get client statistics
router.get('/:id/stats',
  checkPermission('clients', 'read'),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;

      // Verify client exists and belongs to company
      const client = await prisma.client.findFirst({
        where: {
          id,
          companyId: req.user!.companyId,
        },
      });

      if (!client) {
        throw new NotFoundError('Client');
      }

      // Get client statistics
      const [
        totalInvoices,
        totalAmount,
        paidAmount,
        pendingAmount,
        overdueInvoices,
      ] = await Promise.all([
        prisma.invoice.count({
          where: { clientId: id },
        }),
        prisma.invoice.aggregate({
          where: { clientId: id },
          _sum: { totalAmount: true },
        }),
        prisma.payment.aggregate({
          where: { invoice: { clientId: id } },
          _sum: { amount: true },
        }),
        prisma.invoice.aggregate({
          where: {
            clientId: id,
            status: { in: ['PENDING', 'DRAFT'] },
          },
          _sum: { totalAmount: true },
        }),
        prisma.invoice.count({
          where: {
            clientId: id,
            status: 'OVERDUE',
          },
        }),
      ]);

      const stats = {
        totalInvoices,
        totalAmount: totalAmount._sum.totalAmount ? Number(totalAmount._sum.totalAmount) : 0,
        paidAmount: paidAmount._sum.amount ? Number(paidAmount._sum.amount) : 0,
        pendingAmount: pendingAmount._sum.totalAmount ? Number(pendingAmount._sum.totalAmount) : 0,
        overdueInvoices,
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