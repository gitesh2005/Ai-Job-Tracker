import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, type, showToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={cn(
              'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              'disabled:bg-gray-50 disabled:cursor-not-allowed',
              'transition-all duration-200',
              error ? 'border-red-400 bg-red-50/50' : 'hover:border-gray-300',
              isPassword && showToggle ? 'pr-10' : '',
              className
            )}
            {...props}
          />
          {isPassword && showToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M6 9a6 6 0 0112 0m0 0a6 6 0 012.625 5.658m-1.413 1.407A10.05 10.05 0 0112 19c4.478 0 8.268-2.943 9.543-7a9.97 9.97 0 00-1.563-3.029" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;