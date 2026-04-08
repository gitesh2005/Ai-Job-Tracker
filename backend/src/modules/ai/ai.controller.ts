import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { parseJobDescription } from './ai.service';
import ApiResponse from '../../utils/apiResponse';
import ApiError from '../../utils/apiError';

export const parseJob = async (req: AuthRequest, res: Response) => {
  const { jobDescription } = req.body;

  if (!jobDescription || typeof jobDescription !== 'string') {
    throw new ApiError(400, 'Job description is required');
  }

  if (jobDescription.trim().length === 0) {
    throw new ApiError(400, 'Job description cannot be empty');
  }

  if (jobDescription.length > 50000) {
    throw new ApiError(400, 'Job description is too long (max 50000 characters)');
  }

  const result = await parseJobDescription({ jobDescription });
  ApiResponse.success(res, result, 'Job description parsed successfully');
};