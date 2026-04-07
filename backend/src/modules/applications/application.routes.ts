import { Router } from 'express';
import {
  getAllApplications,
  getApplication,
  createNewApplication,
  updateExistingApplication,
  deleteExistingApplication,
  updateStatus,
} from './application.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.use(asyncHandler(authMiddleware));

router.get('/', asyncHandler(getAllApplications));
router.post('/', asyncHandler(createNewApplication));
router.get('/:id', asyncHandler(getApplication));
router.patch('/:id', asyncHandler(updateExistingApplication));
router.delete('/:id', asyncHandler(deleteExistingApplication));
router.patch('/:id/status', asyncHandler(updateStatus));

export default router;