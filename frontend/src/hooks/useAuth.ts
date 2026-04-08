import { useEffect, useState } from 'react';
import { useGetCurrentUser } from '../features/auth/auth.hooks';
import { getStoredUser, isTokenValid } from '../features/auth/auth.utils';
import { User } from '../types';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const token = isTokenValid();
  const storedUser = getStoredUser();
  
  const { data: fetchedUser, isLoading: isFetchingUser, isError } = useGetCurrentUser();

  useEffect(() => {
    if (token && !isFetchingUser) {
      if (fetchedUser) {
        setUser(fetchedUser);
        setIsAuthenticated(true);
      } else if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } else if (!token) {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  }, [token, fetchedUser, storedUser, isFetchingUser, isError]);

  return { user, isAuthenticated, isLoading };
}
