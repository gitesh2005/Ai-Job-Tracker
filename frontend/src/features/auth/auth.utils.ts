import { storage } from '../../utils/storage';
import { User } from '../../types';

export const getStoredUser = (): User | null => {
  return storage.get<User>('user');
};

export const getStoredToken = (): string | null => {
  return storage.get<string>('token');
};

export const isTokenValid = (): boolean => {
  const token = getStoredToken();
  return !!token;
};
