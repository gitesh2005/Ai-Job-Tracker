import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { parseJobDescription } from './ai.service';
import ApiResponse from '../../utils/apiResponse';

export const parseJob = async (req: AuthRequest, res: Response) => {
  const { jobDescription } = req.body;

  const result = await parseJobDescription({ jobDescription });
  ApiResponse.success(res, result, 'Job description parsed successfully');
};