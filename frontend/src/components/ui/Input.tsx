import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-black uppercase tracking-widest mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full p-4 border-2 border-black font-bold outline-none bg-white transition-all focus:bg-brand-red/5',
              icon && 'pl-12',
              error && 'border-brand-red',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-[10px] font-black uppercase text-brand-red tracking-tight">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
