import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';

// Import routes
// import authRoutes from './routes/auth';
// import invoiceRoutes from './routes/invoices';
// import clientRoutes from './routes/clients';
// import supplierRoutes from './routes/suppliers';
// import purchaseRoutes from './routes/purchases';
// import cusdecRoutes from './routes/cusdec';
// import tenderRoutes from './routes/tenders';
// import assetRoutes from './routes/assets';
// import expenseRoutes from './routes/expenses';
// import reportRoutes from './routes/reports';
// import dashboardRoutes from './routes/dashboard';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Trust proxy for accurate IP addresses in production
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000', // for testing
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(null, true); // Allow all origins for now during development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Database connection failed',
      timestamp: new Date().toISOString(),
    });
  }
});

// API version info
app.get('/api', (req, res) => {
  res.json({
    name: 'BizManage ERP API',
    version: '1.0.0',
    description: 'Complete ERP solution for trading companies',
    endpoints: {
      auth: '/api/auth',
      invoices: '/api/invoices',
      clients: '/api/clients',
      suppliers: '/api/suppliers',
      purchases: '/api/purchases',
      cusdec: '/api/cusdec',
      tenders: '/api/tenders',
      assets: '/api/assets',
      expenses: '/api/expenses',
      reports: '/api/reports',
      dashboard: '/api/dashboard',
    },
  });
});

// API routes
import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import invoiceRoutes from './routes/invoices';
import companyRoutes from './routes/companies';
// import supplierRoutes from './routes/suppliers';
// import purchaseRoutes from './routes/purchases';
// import cusdecRoutes from './routes/cusdec';
// import tenderRoutes from './routes/tenders';
// import assetRoutes from './routes/assets';
// import expenseRoutes from './routes/expenses';
// import reportRoutes from './routes/reports';
// import dashboardRoutes from './routes/dashboard';

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/companies', companyRoutes);
// app.use('/api/suppliers', supplierRoutes);
// app.use('/api/purchases', purchaseRoutes);
// app.use('/api/cusdec', cusdecRoutes);
// app.use('/api/tenders', tenderRoutes);
// app.use('/api/assets', assetRoutes);
// app.use('/api/expenses', expenseRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);

  // Prisma error handling
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Unique constraint violation',
      message: 'A record with this value already exists',
      field: err.meta?.target,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Record not found',
      message: 'The requested record does not exist',
    });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({
      error: 'Foreign key constraint failed',
      message: 'Referenced record does not exist',
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message,
      details: err.errors,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'The provided token is malformed or invalid',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      message: 'The provided token has expired',
    });
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: 'The uploaded file exceeds the maximum size limit',
    });
  }

  // Default error response
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal server error' : message,
    message: statusCode >= 500 ? 'Something went wrong on our end' : message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    }),
  });
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Start server
const server = app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 BizManage ERP Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📚 API Info: http://localhost:${PORT}/api`);
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

export default app;