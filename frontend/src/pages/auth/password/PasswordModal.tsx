import { useState } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import LogoSvg from '@/assets/images/logo.svg?react'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/store/auth.store'

interface ModalState {
  backgroundLocation?: Location
  modal?: boolean
}

export function PasswordModal() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const modalState = (location.state as ModalState | undefined) ?? undefined
  const backgroundLocation = modalState?.backgroundLocation
  const { login } = useAuthStore()

  const handleClose = () => {
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname + backgroundLocation.search + backgroundLocation.hash, {
        replace: true,
      })
    } else {
      navigate(ROUTES.HOME, { replace: true })
    }
  }

  const phone = searchParams.get('phone') || ''
  const email = searchParams.get('email') || ''
  const role = searchParams.get('role') || 'tenant'
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const validatePassword = () => {
    if (!password.trim()) {
      setError('Password is required')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleContinue = () => {
    if (!validatePassword()) return

    const mockUser = {
      id: '1',
      name: 'Abdulraheem Abdulsalam',
      email: email || undefined,
      phone: phone || undefined,
      role: role as 'tenant' | 'landlord',
      isVerified: true,
    }
    login(mockUser, 'mock-token')

    if (backgroundLocation) {
      navigate(backgroundLocation.pathname + backgroundLocation.search + backgroundLocation.hash, {
        replace: true,
      })
    } else {
      navigate(ROUTES.HOME)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => {
      if (!open) {
        handleClose()
      }
    }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-6">
        <div className="flex flex-col items-center gap-6">
          <LogoSvg className="h-40 w-40 md:h-44 md:w-44 text-primary" />
          <div className="w-full space-y-6">
            <h1 className="text-2xl font-bold text-foreground text-center">
              Enter Password
            </h1>

            <div className="space-y-2">
              <Label htmlFor="modal-password" className="text-sm font-semibold text-foreground">
                Password
              </Label>
              <Input
                id="modal-password"
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleContinue()
                  }
                }}
                className={`w-full ${error ? 'border-destructive' : ''}`}
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PasswordModal
