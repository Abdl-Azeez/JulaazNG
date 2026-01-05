import * as React from 'react'
import { cn } from '@/shared/lib/utils/cn'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        'h-5 w-5 shrink-0 rounded-md border-2 border-border/60 bg-background',
        'transition-all duration-200 cursor-pointer',
        'hover:border-primary/40 hover:bg-primary/5',
        'checked:bg-primary checked:border-primary',
        'checked:hover:bg-primary/90',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border/60 disabled:hover:bg-background',
        'accent-primary',
        className
      )}
      {...props}
    />
  )
})
Checkbox.displayName = 'Checkbox'

