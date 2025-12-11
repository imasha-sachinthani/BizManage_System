import express from 'express';
import {
  authenticateToken,
  authorizeRoles,
  validateLogin,
  authLimiter,
  login,
  logout,
  refreshToken,
  getProfile,
  changePassword,
  getAuditLogs,
} from '../controllers/authController';

const router = express.Router();

// Public routes
router.post('/login', authLimiter, validateLogin, login);

// Protected routes
router.use(authenticateToken); // All routes below require authentication

router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/profile', getProfile);
router.put('/change-password', changePassword);
router.get('/audit-logs', getAuditLogs);

// Admin only routes
router.use(authorizeRoles(['DIRECTOR', 'ADMIN']));

export default router;