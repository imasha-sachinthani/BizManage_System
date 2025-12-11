import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { Redis } from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

// General API rate limiter
export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many login attempts',
    message: 'Too many login attempts from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  skipSuccessfulRequests: true,
});

// File upload rate limiter
export const uploadLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 uploads per hour
  message: {
    error: 'Upload limit exceeded',
    message: 'Too many file uploads from this IP, please try again later.',
    retryAfter: '1 hour',
  },
});

// Report generation rate limiter
export const reportLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 report generations per 10 minutes
  message: {
    error: 'Report generation limit exceeded',
    message: 'Too many reports generated from this IP, please try again later.',
    retryAfter: '10 minutes',
  },
});

// Export generation rate limiter
export const exportLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // limit each IP to 3 exports per 5 minutes
  message: {
    error: 'Export limit exceeded',
    message: 'Too many exports generated from this IP, please try again later.',
    retryAfter: '5 minutes',
  },
});

export { redis };