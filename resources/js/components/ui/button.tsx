import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700',
    {
        variants: {
            variant: {
                default: 'bg-slate-900 text-white hover:bg-slate-800',
                outline: 'glass text-slate-800 hover:bg-white/70',
                ghost: 'text-slate-700 hover:bg-white/40',
                destructive: 'bg-red-500 text-white hover:bg-red-400',
            },
            size: {
                default: 'h-11 px-5',
                sm: 'h-9 px-4 text-xs',
                lg: 'h-12 px-7',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    ),
);

Button.displayName = 'Button';
