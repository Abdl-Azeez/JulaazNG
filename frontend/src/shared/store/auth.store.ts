import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name?: string
  email?: string
  phone?: string
  role?: 'tenant' | 'landlord' | 'service_provider' | 'artisan' | 'property_manager' | 'admin'
  isVerified?: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  login: (user: User, token: string) => void
  setUser: (user: User | null) => void
  logout: () => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: (user, token) => set({ isAuthenticated: true, user, token }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false, token: null }),
      clearAuth: () => set({ user: null, isAuthenticated: false, token: null }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
)

