import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IconSvg from '@/assets/images/icon.svg?react'
import './SplashScreen.css'

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Total animation duration: ~3.2s
    const timer = setTimeout(() => {
      setIsVisible(false)
      // Wait for fade-out animation to complete before calling onComplete
      setTimeout(onComplete, 500)
    }, 3200)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Expanding circle background */}
          <motion.div
            className="splash-screen__circle"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ 
              scale: 25,
              opacity: 1,
            }}
            transition={{
              duration: 2.5,
              ease: 'easeOut',
              delay: 0.1,
            }}
          />
          
          <div className="splash-screen__container">
            <motion.div
              className="splash-screen__icon-wrapper"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1], // Bounce effect
                delay: 0.3,
              }}
            >
              <IconSvg className="splash-screen__icon" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
