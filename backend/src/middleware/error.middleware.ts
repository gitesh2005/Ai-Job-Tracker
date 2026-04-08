import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isAuthError = err instanceof ApiError && 
    (err.statusCode === 401 || err.statusCode === 404) &&
    (err.message === 'Invalid token' || 
     err.message === 'Token expired' || 
     err.message === 'User not found' ||
     err.message === 'No token provided' ||
     err.message === 'Authentication failed');

  if (!isAuthError) {
    console.error('Error:', err);
  }

  if (err.name === 'MongoError' && err.message.includes('E11000')) {
    const field = err.message.includes('email') ? 'Email' : 'Field';
    const error = new ApiError(400, `${field} already exists`);
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    const error = new ApiError(400, 'Invalid ID format');
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map(e => e.message).join(', ');
    const error = new ApiError(400, messages || 'Validation error');
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (err.name === 'JsonWebTokenError' || err instanceof jwt.JsonWebTokenError) {
    const error = new ApiError(401, 'Invalid token');
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (err.name === 'TokenExpiredError' || err instanceof jwt.TokenExpiredError) {
    const error = new ApiError(401, 'Token expired');
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};

export default errorMiddleware;