export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: ValidationError[];

  constructor(message: string, statusCode = 500, errors?: ValidationError[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationErrorClass extends AppError {
  constructor(errors: ValidationError[]) {
    super('Validation failed', 400, errors);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message = 'External service unavailable') {
    super(`${service}: ${message}`, 502);
  }
}