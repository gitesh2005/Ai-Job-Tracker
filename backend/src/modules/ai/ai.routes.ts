import { Router } from 'express';
import { parseJob } from './ai.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.post('/parse-job-description', asyncHandler(authMiddleware), asyncHandler(parseJob));

export default router;