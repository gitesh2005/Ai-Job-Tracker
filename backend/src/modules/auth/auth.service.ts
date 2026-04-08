import jwt from 'jsonwebtoken';
import User, { IUser } from './auth.model';
import config from '../../config/env';
import ApiError from '../../utils/apiError';
import { RegisterInput, LoginInput, AuthResponse } from './auth.types';

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const existingUser = await User.findOne({ email: input.email.toLowerCase().trim() });
  if (existingUser) {
    throw new ApiError(400, 'Email already exists');
  }

  const user = await User.create({
    email: input.email.toLowerCase().trim(),
    password: input.password,
  });

  const token = generateToken(user);
  return {
    user: {
      id: user._id.toString(),
      email: user.email,
    },
    token,
  };
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await User.findOne({ email: input.email.toLowerCase().trim() }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(input.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = generateToken(user);
  return {
    user: {
      id: user._id.toString(),
      email: user.email,
    },
    token,
  };
};

export const getCurrentUser = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId).select('-password');
};

const generateToken = (user: IUser): string => {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};