import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("animate-pulse bg-black/10 rounded-sm", className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
