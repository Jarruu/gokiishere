import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface BrutalistCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const BrutalistCard = forwardRef<HTMLDivElement, BrutalistCardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn('brutalist-card', className)} 
        {...props}
      >
        {children}
      </div>
    );
  }
);

BrutalistCard.displayName = 'BrutalistCard';
