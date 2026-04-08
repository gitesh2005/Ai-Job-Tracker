import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '../features/auth/auth.hooks';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const registerUser = useRegister();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string>('');

  const onSubmit = (data: RegisterFormData) => {
    setApiError('');
    if (data.password !== data.confirmPassword) {
      return;
    }
    registerUser.mutate({ email: data.email, password: data.password }, {
      onSuccess: () => {
        navigate('/');
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } };
        setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
      },
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Start tracking your job applications</p>
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
            placeholder="Create a password"
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              validate: {
                hasUppercase: (value) => /[A-Z]/.test(value) || 'Password must contain at least 1 uppercase letter',
                hasLowercase: (value) => /[a-z]/.test(value) || 'Password must contain at least 1 lowercase letter',
                hasNumber: (value) => /[0-9]/.test(value) || 'Password must contain at least 1 number',
                hasSpecial: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Password must contain at least 1 special character',
              }
            })}
            error={errors.password?.message}
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: (value, formValues) => 
                value === formValues.password || 'Passwords do not match'
            })}
            error={errors.confirmPassword?.message}
          />

          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{apiError}</p>
            </div>
          )}

          <Button type="submit" className="w-full !py-2.5" isLoading={registerUser.isPending}>
            Sign Up
          </Button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}