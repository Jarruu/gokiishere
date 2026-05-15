import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  highlight?: string;
  subtitle?: string;
  isItalic?: boolean;
}

export const SectionTitle = forwardRef<HTMLDivElement, SectionTitleProps>(
  ({ title, highlight, subtitle, isItalic = false, className, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn('mb-12', className)} 
        {...props}
      >
        <h2 className={cn(
          'text-4xl md:text-6xl font-black uppercase tracking-tighter',
          isItalic && 'italic'
        )}>
          {title} {highlight && <span className="text-brand-red">{highlight}</span>}
        </h2>
        {subtitle && (
          <p className="font-mono text-sm uppercase opacity-60 mt-2">
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);

SectionTitle.displayName = 'SectionTitle';
