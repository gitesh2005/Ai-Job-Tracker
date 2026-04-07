import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if (err.name === 'MongoError' && err.message.includes('E11000')) {
    const field = err.message.includes('email') ? 'Email' : 'Field';
    const error = new ApiError(400, `${field} already exists`);
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