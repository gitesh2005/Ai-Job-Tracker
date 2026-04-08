import { Router } from 'express';
import { registerUser, loginUser, getMe } from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { authLimiter } from '../../middleware/security.middleware';

const router = Router();

router.post('/register', authLimiter, asyncHandler(registerUser));
router.post('/login', authLimiter, asyncHandler(loginUser));
router.get('/me', asyncHandler(authMiddleware), asyncHandler(getMe));

export default router;