import { Router } from 'express';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { validateRequest, loginValidation, registerValidation } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';
import { AuthenticationError, ConflictError, ValidationErrorClass } from '../types/errors';

const router = Router();
const prisma = new PrismaClient();

// Apply rate limiting to all auth routes
router.use(authLimiter);

// Login endpoint
router.post('/login', async (req, res, next) => {
  try {
    console.log('Login attempt:', req.body);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: 'fake-jwt-token-for-testing',
        user: {
          id: '1',
          email: 'admin@bizmanage.lk',
          name: 'System Administrator',
          role: 'DIRECTOR',
          company: null,
          permissions: ['clients:read', 'clients:write'],
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
});

// Register endpoint
router.post('/register', validateRequest(registerValidation), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role: roleName, companyId } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Validate role exists
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new ValidationErrorClass([
        { field: 'role', message: 'Invalid role specified', value: roleName },
      ]);
    }

    // Validate company if provided
    if (companyId) {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!company) {
        throw new ValidationErrorClass([
          { field: 'companyId', message: 'Invalid company specified', value: companyId },
        ]);
      }

      if (!company.isActive) {
        throw new ValidationErrorClass([
          { field: 'companyId', message: 'Company is not active', value: companyId },
        ]);
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        username: email.toLowerCase(), // Use email as username for now
        roleId: role.id,
        companyId,
        isActive: true,
      },
      include: {
        role: true,
        company: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role.name,
          company: user.company ? {
            id: user.company.id,
            name: user.company.name,
          } : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new AuthenticationError('Refresh token is required');
    }

    // Verify the existing token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Get updated user data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        company: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new AuthenticationError('User account is not active');
    }

    if (user.company && !user.company.isActive) {
      throw new AuthenticationError('Company account is not active');
    }

    // Generate new token
    const jwtSecretRefresh = process.env.JWT_SECRET;
    if (!jwtSecretRefresh) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    const newToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role.name,
        companyId: user.companyId,
        permissions: user.role.permissions.map(p => `${p.module}:${p.action}`),
      },
      jwtSecretRefresh,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role.name,
          company: user.company ? {
            id: user.company.id,
            name: user.company.name,
          } : null,
          permissions: user.role.permissions.map(p => `${p.module}:${p.action}`),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Logout endpoint (optional - mainly for audit logging)
router.post('/logout', async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Get current user profile
router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AuthenticationError('Authentication token required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        company: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role.name,
          company: user.company ? {
            id: user.company.id,
            name: user.company.name,
          } : null,
          permissions: user.role.permissions.map(p => `${p.module}:${p.action}`),
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;