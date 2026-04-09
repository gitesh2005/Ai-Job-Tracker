import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../../features/auth/auth.hooks';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface LoginFormData {
  email: string;
  password: string;
}

export default function AuthForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const login = useLogin();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string>('');

  const onSubmit = (data: LoginFormData) => {
    setApiError('');
    login.mutate(data, {
      onSuccess: () => {
        navigate('/');
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } };
        setApiError(err.response?.data?.message || 'Login failed. Please try again.');
      },
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to track your job applications</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            showToggle
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message}
          />

          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{apiError}</p>
            </div>
          )}

          <Button type="submit" className="w-full !py-2.5" isLoading={login.isPending}>
            Sign In
          </Button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}