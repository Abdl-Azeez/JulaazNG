import { motion } from 'framer-motion'
import LogoSvg from '@/assets/images/logo.svg?react'
import './LogoLoader.css'

interface LogoLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LogoLoader({ size = 'md', className = '' }: LogoLoaderProps) {
  const sizeClasses = {
    sm: 'logo-loader--sm',
    md: 'logo-loader--md',
    lg: 'logo-loader--lg',
  }

  return (
    <motion.div
      className={`logo-loader ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <LogoSvg className="logo-loader__svg" />
    </motion.div>
  )
}
