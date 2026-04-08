import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { register, login, getCurrentUser } from './auth.service';
import ApiResponse from '../../utils/apiResponse';
import ApiError from '../../utils/apiError';
import { validateEmail, validatePassword } from '../../utils/validation';

export const registerUser = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  validateEmail(email);
  validatePassword(password);

  const result = await register({ email, password });
  ApiResponse.created(res, result, 'User registered successfully');
};

export const loginUser = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const result = await login({ email, password });
  ApiResponse.success(res, result, 'Login successful');
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const user = await getCurrentUser(req.user.userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  ApiResponse.success(res, {
    id: user._id,
    email: user.email,
    createdAt: user.createdAt,
  });
};