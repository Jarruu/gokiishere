import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  label?: string;
  value: string;
  options: (string | DropdownOption)[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  fullWidth?: boolean;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ label, value, options, onChange, icon, className, placeholder = 'Select Option', fullWidth = true }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const normalizedOptions: DropdownOption[] = options.map(opt => 
      typeof opt === 'string' ? { label: opt, value: opt } : opt
    );

    const selectedOption = normalizedOptions.find(opt => opt.value === value);

    return (
      <div className={cn(fullWidth ? 'w-full' : 'w-auto', className)} ref={dropdownRef}>
        {label && (
          <label className="block text-xs font-black uppercase tracking-widest mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'flex items-center justify-between p-4 border-2 border-black bg-white font-bold outline-none transition-all hover:bg-brand-red/5',
              fullWidth ? 'w-full' : 'min-w-[160px]',
              isOpen && 'bg-brand-red/5'
            )}
          >
            <div className="flex items-center gap-3">
              {icon && <span className="opacity-40">{icon}</span>}
              <span className="uppercase text-sm truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            <ChevronDown size={20} className={cn('transition-transform duration-300', isOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-black shadow-[6px_6px_0px_0px_var(--color-black)] z-[100] max-h-60 overflow-y-auto"
              >
                {normalizedOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 font-bold uppercase text-xs border-b-2 border-black last:border-b-0 hover:bg-brand-red hover:text-white transition-colors flex items-center gap-3',
                      value === option.value && 'bg-brand-red/10'
                    )}
                  >
                    {option.icon && <span>{option.icon}</span>}
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
