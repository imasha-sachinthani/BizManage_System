import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errors';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error, res);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: 'Database validation error',
      message: 'Invalid data provided for database operation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }

  // Handle custom application errors
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      message: error.message,
      errors: error.errors,
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Authentication token is invalid',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      message: 'Authentication token has expired',
    });
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: error.message,
    });
  }

  // Handle multer errors (file upload)
  if (error.name === 'MulterError') {
    return res.status(400).json({
      error: 'File upload error',
      message: error.message,
    });
  }

  // Handle syntax errors in request body
  if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON',
    });
  }

  // Default server error
  return res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Something went wrong on our end',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError, res: Response) => {
  switch (error.code) {
    case 'P2002':
      return res.status(409).json({
        error: 'Unique constraint violation',
        message: 'A record with this data already exists',
        field: error.meta?.target,
      });

    case 'P2014':
      return res.status(400).json({
        error: 'Invalid relation',
        message: 'The change you are trying to make would violate a relation constraint',
      });

    case 'P2003':
      return res.status(400).json({
        error: 'Foreign key constraint violation',
        message: 'This operation would violate a foreign key constraint',
      });

    case 'P2025':
      return res.status(404).json({
        error: 'Record not found',
        message: 'The requested record does not exist',
      });

    case 'P2016':
      return res.status(400).json({
        error: 'Query interpretation error',
        message: 'The query could not be interpreted',
      });

    case 'P2021':
      return res.status(404).json({
        error: 'Table not found',
        message: 'The requested table does not exist in the database',
      });

    case 'P2022':
      return res.status(404).json({
        error: 'Column not found',
        message: 'The requested column does not exist in the database',
      });

    default:
      console.error('Unhandled Prisma error:', error.code, error.message);
      return res.status(500).json({
        error: 'Database error',
        message: 'An unexpected database error occurred',
        code: error.code,
      });
  }
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/invoices',
      'GET /api/clients',
      'GET /api/companies',
    ],
  });
};