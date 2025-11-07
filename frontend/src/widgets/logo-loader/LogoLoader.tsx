import { motion } from 'framer-motion'
import LogoSvg from '@/assets/images/logo.svg?react'
import './LogoLoader.css'
import { cn } from '@/shared/lib/utils/cn'

interface LogoLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'white' | 'foreground'
  className?: string
}

export function LogoLoader({ 
  size = 'md', 
  variant = 'primary',
  className = '' 
}: LogoLoaderProps) {
  const sizeClasses = {
    sm: 'logo-loader--sm',
    md: 'logo-loader--md',
    lg: 'logo-loader--lg',
  }

  const variantClasses = {
    primary: 'logo-loader--primary',
    white: 'logo-loader--white',
    foreground: 'logo-loader--foreground',
  }

  return (
    <motion.div
      className={cn(
        'logo-loader',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <LogoSvg className="logo-loader__svg" />
    </motion.div>
  )
}
