import { Router } from 'express';
import { registerUser, loginUser, getMe } from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.get('/me', asyncHandler(authMiddleware), asyncHandler(getMe));

export default router;