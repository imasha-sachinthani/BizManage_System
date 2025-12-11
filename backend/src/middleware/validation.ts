import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../types/errors';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'date' | 'array';
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export const validateRequest = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: ValidationError[] = [];
    const data = { ...req.body, ...req.params, ...req.query };

    rules.forEach((rule) => {
      const value = data[rule.field];

      // Check required fields
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} is required`,
          value,
        });
        return;
      }

      // Skip validation if field is not required and empty
      if (!rule.required && (value === undefined || value === null || value === '')) {
        return;
      }

      // Type validation
      if (rule.type) {
        switch (rule.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push({
                field: rule.field,
                message: rule.message || `${rule.field} must be a string`,
                value,
              });
            }
            break;
          case 'number':
            if (typeof value !== 'number' && isNaN(Number(value))) {
              errors.push({
                field: rule.field,
                message: rule.message || `${rule.field} must be a number`,
                value,
              });
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
              errors.push({
                field: rule.field,
                message: rule.message || `${rule.field} must be a boolean`,
                value,
              });
            }
            break;
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(String(value))) {
              errors.push({
                field: rule.field,
                message: rule.message || `${rule.field} must be a valid email`,
                value,
              });
            }
            break;
          case 'date':
            if (isNaN(Date.parse(value))) {
              errors.push({
                field: rule.field,
                message: rule.message || `${rule.field} must be a valid date`,
                value,
              });
            }
            break;
          case 'array':
            if (!Array.isArray(value)) {
              errors.push({
                field: rule.field,
                message: rule.message || `${rule.field} must be an array`,
                value,
              });
            }
            break;
        }
      }

      // Length validation
      if (rule.min !== undefined && String(value).length < rule.min) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} must be at least ${rule.min} characters`,
          value,
        });
      }

      if (rule.max !== undefined && String(value).length > rule.max) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} must be no more than ${rule.max} characters`,
          value,
        });
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(String(value))) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} format is invalid`,
          value,
        });
      }

      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} validation failed`,
          value,
        });
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'The request contains invalid data',
        errors,
      });
    }

    next();
  };
};

// Common validation rules
export const loginValidation = [
  { field: 'email', required: true, type: 'email' as const },
  { field: 'password', required: true, type: 'string' as const, min: 6 },
];

export const registerValidation = [
  { field: 'email', required: true, type: 'email' as const },
  { field: 'password', required: true, type: 'string' as const, min: 8 },
  { field: 'firstName', required: true, type: 'string' as const, min: 2, max: 100 },
  { field: 'lastName', required: true, type: 'string' as const, min: 2, max: 100 },
  { field: 'role', required: true, type: 'string' as const },
];

export const clientValidation = [
  { field: 'name', required: true, type: 'string' as const, min: 2, max: 200 },
  { field: 'email', required: false, type: 'email' as const },
  { field: 'phone', required: false, type: 'string' as const, min: 7, max: 20 },
  { field: 'mobile', required: false, type: 'string' as const, min: 7, max: 20 },
  { field: 'address', required: false, type: 'string' as const, max: 500 },
  { field: 'city', required: false, type: 'string' as const, max: 100 },
  { field: 'country', required: false, type: 'string' as const, max: 100 },
  { field: 'taxId', required: false, type: 'string' as const, max: 50 },
  { field: 'creditLimit', required: false, type: 'number' as const },
  { field: 'paymentTerms', required: false, type: 'number' as const },
  { field: 'category', required: false, type: 'string' as const },
  { field: 'notes', required: false, type: 'string' as const, max: 1000 },
];

export const invoiceValidation = [
  { field: 'clientId', required: true, type: 'string' as const },
  { field: 'amount', required: true, type: 'number' as const },
  { field: 'dueDate', required: true, type: 'date' as const },
  { field: 'items', required: true, type: 'array' as const },
];

export const purchaseValidation = [
  { field: 'supplierId', required: true, type: 'string' as const },
  { field: 'totalAmount', required: true, type: 'number' as const },
  { field: 'purchaseDate', required: true, type: 'date' as const },
  { field: 'items', required: true, type: 'array' as const },
];

export const paymentValidation = [
  { field: 'amount', required: true, type: 'number' as const },
  { field: 'paymentMethod', required: true, type: 'string' as const },
  { field: 'paymentDate', required: true, type: 'date' as const },
];

export const tenderValidation = [
  { field: 'title', required: true, type: 'string' as const, min: 5, max: 200 },
  { field: 'description', required: true, type: 'string' as const, min: 10, max: 2000 },
  { field: 'openingDate', required: true, type: 'date' as const },
  { field: 'closingDate', required: true, type: 'date' as const },
  { field: 'estimatedValue', required: false, type: 'number' as const },
];