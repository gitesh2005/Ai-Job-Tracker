import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            'disabled:bg-gray-50 disabled:cursor-not-allowed resize-none',
            'transition-all duration-200',
            error ? 'border-red-400 bg-red-50/50' : 'hover:border-gray-300',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;