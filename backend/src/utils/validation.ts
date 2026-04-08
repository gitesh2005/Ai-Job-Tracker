import ApiError from './apiError';

export const validatePassword = (password: string): void => {
  if (!password || password.length === 0) {
    throw new ApiError(400, 'Password is required');
  }

  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    throw new ApiError(400, 'Password must contain at least 1 uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    throw new ApiError(400, 'Password must contain at least 1 lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    throw new ApiError(400, 'Password must contain at least 1 number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new ApiError(400, 'Password must contain at least 1 special character');
  }
};

export const validateEmail = (email: string): void => {
  if (!email || email.length === 0) {
    throw new ApiError(400, 'Email is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, 'Invalid email format');
  }
};

export const validateRequiredFields = (
  obj: Record<string, unknown>,
  fields: string[]
): void => {
  for (const field of fields) {
    const value = obj[field];
    if (value === undefined || value === null || value === '') {
      throw new ApiError(400, `${field} is required`);
    }
  }
};