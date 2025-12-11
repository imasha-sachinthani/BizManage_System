import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authConfig } from '../config';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    companyId?: string;
    firstName: string;
    lastName: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, authConfig.jwtSecret) as any;
    
    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        role: {
          select: {
            name: true,
            permissions: {
              select: {
                module: true,
                action: true,
              },
            },
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'User not found or inactive',
      });
    }

    if (user.company && !user.company.isActive) {
      return res.status(403).json({
        error: 'Company inactive',
        message: 'Your company account has been deactivated',
      });
    }

    // Attach user info to request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
      companyId: user.companyId || undefined,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is malformed or invalid',
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again',
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error during authentication',
    });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, authConfig.jwtSecret) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (user && user.isActive) {
      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role.name,
        companyId: user.companyId || undefined,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    }

    next();
  } catch (error) {
    // If optional auth fails, just continue without user
    next();
  }
};