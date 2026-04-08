import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from './auth.api';
import { storage } from '../../utils/storage';
import { LoginInput, RegisterInput } from '../../types';

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (data) => {
      storage.set('token', data.token);
      storage.set('user', data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (data) => {
      storage.set('token', data.token);
      storage.set('user', data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

export const useGetCurrentUser = (userId?: string) => {
  return useQuery({
    queryKey: userId ? ['currentUser', userId] : ['currentUser'],
    queryFn: () => authApi.getCurrentUser(),
    enabled: !!storage.get<string>('token'),
    retry: 1,
    staleTime: 0,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return () => {
    storage.remove('token');
    storage.remove('user');
    queryClient.clear();
    window.location.href = '/login';
  };
};