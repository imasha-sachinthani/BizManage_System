import express from 'express';
import {
  authenticateToken,
  authorizeRoles,
} from '../controllers/authController';
import {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  recordPayment,
  generateInvoicePDF,
  sendInvoiceEmail,
  getInvoiceAnalytics,
  validateInvoice,
} from '../controllers/invoiceController';

const router = express.Router();

// All invoice routes require authentication
router.use(authenticateToken);

// Invoice CRUD operations
router.get('/', getInvoices);
router.get('/analytics', getInvoiceAnalytics);
router.get('/:id', getInvoice);
router.post('/', validateInvoice, createInvoice);
router.put('/:id', updateInvoice);

// Invoice-specific actions
router.post('/:id/payments', recordPayment);
router.get('/:id/pdf', generateInvoicePDF);
router.post('/:id/send', 
  authorizeRoles(['DIRECTOR', 'ACCOUNTS', 'EXECUTIVE']), 
  sendInvoiceEmail
);

export default router;