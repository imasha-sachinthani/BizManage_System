import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from './auth';

const prisma = new PrismaClient();

export const checkPermission = (module: string, action: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'Please login to access this resource',
        });
      }

      // Get user with role and permissions
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(401).json({
          error: 'User not found',
          message: 'Invalid user credentials',
        });
      }

      // Check if user's role has the required permission
      const hasPermission = user.role.permissions.some(
        (permission) => permission.module === module && permission.action === action
      );

      if (!hasPermission) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: `You don't have permission to ${action} ${module}`,
          required: `${module}:${action}`,
          userRole: user.role.name,
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        error: 'Permission check failed',
        message: 'Internal server error during permission validation',
      });
    }
  };
};

export const checkRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login to access this resource',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Your role does not have access to this resource',
        userRole: req.user.role,
        allowedRoles,
      });
    }

    next();
  };
};

export const checkCompany = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    if (!req.user.companyId) {
      return res.status(403).json({
        error: 'Company required',
        message: 'User must be associated with a company',
      });
    }

    // Verify company is active
    const company = await prisma.company.findUnique({
      where: { id: req.user.companyId },
    });

    if (!company || !company.isActive) {
      return res.status(403).json({
        error: 'Company inactive',
        message: 'Company account is not active',
      });
    }

    next();
  } catch (error) {
    console.error('Company check error:', error);
    return res.status(500).json({
      error: 'Company validation failed',
    });
  }
};