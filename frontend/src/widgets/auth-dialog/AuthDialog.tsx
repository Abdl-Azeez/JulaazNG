import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Smart authentication dialog that navigates directly to login page
 * instead of showing a selection screen
 */
export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (open) {
      // Pass current location as background so it shows behind the modal
      navigate(ROUTES.LOGIN, {
        state: { 
          backgroundLocation: location,
          modal: true 
        }
      })
      onOpenChange(false)
    }
  }, [open, navigate, onOpenChange, location])

  return null
}

