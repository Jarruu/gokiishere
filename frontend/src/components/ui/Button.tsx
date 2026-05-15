import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "../../lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "black";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", children, className, ...props }, ref) => {
    const variantStyles = {
      primary:
        "bg-brand-red text-white shadow-[4px_4px_0px_0px_var(--color-black)] hover:shadow-[6px_6px_0px_0px_var(--color-black)]",
      secondary:
        "bg-white text-black shadow-[4px_4px_0px_0px_var(--color-black)] hover:shadow-[6px_6px_0px_0px_var(--color-black)]",
      black:
        "bg-black text-white shadow-[4px_4px_0px_0px_var(--color-black)] hover:shadow-none",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, x: -2, y: -2 }}
        whileTap={{ scale: 0.98, x: 2, y: 2 }}
        className={cn(
          "brutalist-button px-6 py-3 font-black uppercase tracking-widest transition-all",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
