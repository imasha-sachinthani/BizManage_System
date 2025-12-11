import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { checkPermission, checkRole } from '../middleware/permissions';
import { validateRequest } from '../middleware/validation';
import { NotFoundError, ValidationErrorClass, AuthorizationError } from '../types/errors';

const router = Router();
const prisma = new PrismaClient();

// Apply authentication to all routes
router.use(authenticateToken);

// Company validation rules
const companyValidation = [
  { field: 'name', required: true, type: 'string' as const, min: 2, max: 200 },
  { field: 'email', required: false, type: 'email' as const },
  { field: 'phone', required: false, type: 'string' as const, min: 10, max: 15 },
  { field: 'address', required: false, type: 'string' as const, max: 500 },
  { field: 'taxNumber', required: false, type: 'string' as const, max: 50 },
];

// Get all companies (Super Admin only)
router.get('/',
  checkRole(['SUPER_ADMIN']),
  async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const where: any = {};

      // Search functionality
      if (search) {
        where.OR = [
          { name: { contains: String(search), mode: 'insensitive' } },
          { email: { contains: String(search), mode: 'insensitive' } },
          { taxNumber: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      // Status filter
      if (status) {
        where.isActive = status === 'active';
      }

      // Get companies with pagination
      const [companies, total] = await Promise.all([
        prisma.company.findMany({
          where,
          skip,
          take,
          orderBy: {
            [String(sortBy)]: String(sortOrder),
          },
          include: {
            _count: {
              select: {
                users: true,
                clients: true,
                invoices: true,
              },
            },
          },
        }),
        prisma.company.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          companies,
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

// Get current user's company
router.get('/me',
  async (req, res, next) => {
    try {
      if (!req.user!.companyId) {
        throw new NotFoundError('Company association');
      }

      const company = await prisma.company.findUnique({
        where: { id: req.user!.companyId },
        include: {
          _count: {
            select: {
              users: true,
              clients: true,
              suppliers: true,
              invoices: true,
              purchases: true,
            },
          },
        },
      });

      if (!company) {
        throw new NotFoundError('Company');
      }

      res.json({
        success: true,
        data: { company },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get company by ID
router.get('/:id',
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // Super Admin can access any company, others only their own
      if (req.user!.role !== 'SUPER_ADMIN' && req.user!.companyId !== id) {
        throw new AuthorizationError('Cannot access other company data');
      }

      const company = await prisma.company.findUnique({
        where: { id },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: {
                select: {
                  name: true,
                },
              },
              isActive: true,
              lastLogin: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              clients: true,
              suppliers: true,
              invoices: true,
              purchases: true,
              assets: true,
            },
          },
        },
      });

      if (!company) {
        throw new NotFoundError('Company');
      }

      res.json({
        success: true,
        data: { company },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create new company (Super Admin only)
router.post('/',
  checkRole(['SUPER_ADMIN']),
  validateRequest(companyValidation),
  async (req, res, next) => {
    try {
      const { 
        name, 
        email, 
        phone, 
        address, 
        taxNumber, 
        website, 
        industry, 
        logo,
        subscriptionPlan = 'BASIC',
      } = req.body;

      // Check if company with same name or email exists
      const existingCompany = await prisma.company.findFirst({
        where: {
          OR: [
            { name: { equals: name, mode: 'insensitive' } },
            ...(email ? [{ email: email.toLowerCase() }] : []),
          ],
        },
      });

      if (existingCompany) {
        const field = existingCompany.name.toLowerCase() === name.toLowerCase() ? 'name' : 'email';
        throw new ValidationErrorClass([
          { field, message: `Company with this ${field} already exists`, value: field === 'name' ? name : email },
        ]);
      }

      const company = await prisma.company.create({
        data: {
          name,
          email: email?.toLowerCase(),
          phone,
          address,
          taxNumber,
          website,
          industry,
          logo,
          subscriptionPlan,
          isActive: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Company created successfully',
        data: { company },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update company
router.put('/:id',
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { 
        name, 
        email, 
        phone, 
        address, 
        taxNumber, 
        website, 
        industry, 
        logo,
        subscriptionPlan,
        isActive,
      } = req.body;

      // Permission check: Super Admin can update any company, Company Admin can update their own
      if (req.user!.role === 'SUPER_ADMIN') {
        // Super admin can update any company
      } else if (req.user!.role === 'COMPANY_ADMIN' && req.user!.companyId === id) {
        // Company admin can update their own company (but not subscription or active status)
        if (subscriptionPlan !== undefined || isActive !== undefined) {
          throw new AuthorizationError('Cannot modify subscription or active status');
        }
      } else {
        throw new AuthorizationError('Cannot update company information');
      }

      // Check if company exists
      const existingCompany = await prisma.company.findUnique({
        where: { id },
      });

      if (!existingCompany) {
        throw new NotFoundError('Company');
      }

      // Check if name or email conflicts with other companies
      if (name || email) {
        const conflicts = await prisma.company.findFirst({
          where: {
            OR: [
              ...(name ? [{ name: { equals: name, mode: 'insensitive' } }] : []),
              ...(email ? [{ email: email.toLowerCase() }] : []),
            ],
            id: { not: id },
          },
        });

        if (conflicts) {
          const field = conflicts.name.toLowerCase() === name?.toLowerCase() ? 'name' : 'email';
          throw new ValidationErrorClass([
            { field, message: `Company with this ${field} already exists`, value: field === 'name' ? name : email },
          ]);
        }
      }

      const company = await prisma.company.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(email && { email: email.toLowerCase() }),
          ...(phone !== undefined && { phone }),
          ...(address !== undefined && { address }),
          ...(taxNumber !== undefined && { taxNumber }),
          ...(website !== undefined && { website }),
          ...(industry !== undefined && { industry }),
          ...(logo !== undefined && { logo }),
          ...(subscriptionPlan && req.user!.role === 'SUPER_ADMIN' && { subscriptionPlan }),
          ...(isActive !== undefined && req.user!.role === 'SUPER_ADMIN' && { isActive }),
          updatedAt: new Date(),
        },
      });

      res.json({
        success: true,
        message: 'Company updated successfully',
        data: { company },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete/Deactivate company (Super Admin only)
router.delete('/:id',
  checkRole(['SUPER_ADMIN']),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if company exists
      const company = await prisma.company.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              users: true,
              invoices: true,
              purchases: true,
            },
          },
        },
      });

      if (!company) {
        throw new NotFoundError('Company');
      }

      // Check if company has data
      if (company._count.invoices > 0 || company._count.purchases > 0) {
        // Soft delete - deactivate instead of deleting
        await prisma.company.update({
          where: { id },
          data: { isActive: false, updatedAt: new Date() },
        });

        // Deactivate all users in the company
        await prisma.user.updateMany({
          where: { companyId: id },
          data: { isActive: false },
        });

        return res.json({
          success: true,
          message: 'Company deactivated successfully (has existing data)',
          data: { action: 'deactivated' },
        });
      }

      // Hard delete if no transactions
      await prisma.company.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Company deleted successfully',
        data: { action: 'deleted' },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get company statistics
router.get('/:id/stats',
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // Permission check
      if (req.user!.role !== 'SUPER_ADMIN' && req.user!.companyId !== id) {
        throw new AuthorizationError('Cannot access company statistics');
      }

      // Verify company exists
      const company = await prisma.company.findUnique({
        where: { id },
      });

      if (!company) {
        throw new NotFoundError('Company');
      }

      // Get company statistics
      const [
        totalUsers,
        activeUsers,
        totalClients,
        totalSuppliers,
        totalInvoices,
        totalRevenue,
        totalPurchases,
        totalExpenses,
      ] = await Promise.all([
        prisma.user.count({
          where: { companyId: id },
        }),
        prisma.user.count({
          where: { companyId: id, isActive: true },
        }),
        prisma.client.count({
          where: { companyId: id, isActive: true },
        }),
        prisma.supplier.count({
          where: { companyId: id, isActive: true },
        }),
        prisma.invoice.count({
          where: { companyId: id },
        }),
        prisma.invoice.aggregate({
          where: { companyId: id, status: 'PAID' },
          _sum: { netAmount: true },
        }),
        prisma.purchase.count({
          where: { companyId: id },
        }),
        prisma.purchase.aggregate({
          where: { companyId: id },
          _sum: { totalAmount: true },
        }),
      ]);

      const stats = {
        users: {
          total: totalUsers,
          active: activeUsers,
        },
        clients: {
          total: totalClients,
        },
        suppliers: {
          total: totalSuppliers,
        },
        invoices: {
          total: totalInvoices,
          revenue: totalRevenue._sum.netAmount || 0,
        },
        purchases: {
          total: totalPurchases,
          expenses: totalExpenses._sum.totalAmount || 0,
        },
        profit: (totalRevenue._sum.netAmount || 0) - (totalExpenses._sum.totalAmount || 0),
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

// Update company settings
router.put('/:id/settings',
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { settings } = req.body;

      // Permission check
      if (req.user!.role !== 'SUPER_ADMIN' && req.user!.companyId !== id) {
        throw new AuthorizationError('Cannot update company settings');
      }

      if (!req.user!.role.includes('ADMIN')) {
        throw new AuthorizationError('Only admins can update company settings');
      }

      const company = await prisma.company.update({
        where: { id },
        data: {
          settings,
          updatedAt: new Date(),
        },
      });

      res.json({
        success: true,
        message: 'Company settings updated successfully',
        data: { company },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;