import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const target = e.target as HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        // Set textarea value to: text before caret + tab + text after caret
        target.value = target.value.substring(0, start) + "    " + target.value.substring(end);

        // Put caret at right position again
        target.selectionStart = target.selectionEnd = start + 4;
        
        // Trigger onChange if provided
        if (props.onChange) {
          const event = {
            target: target,
            currentTarget: target,
          } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
          props.onChange(event);
        }
      }
      if (onKeyDown) onKeyDown(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-black uppercase tracking-widest mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full p-4 border-2 border-black font-bold outline-none bg-white transition-all focus:bg-brand-red/5 min-h-[200px] leading-relaxed',
            error && 'border-brand-red',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-[10px] font-black uppercase text-brand-red tracking-tight">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
