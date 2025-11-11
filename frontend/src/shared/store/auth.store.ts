import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useRoleStore, type RoleType } from './role.store'

export interface User {
  id: string
  name?: string
  email?: string
  phone?: string
  role?: 'tenant' | 'landlord' | 'service_provider' | 'artisan' | 'property_manager' | 'admin' | 'handyman' | 'homerunner'
  isVerified?: boolean
  roles?: RoleType[]
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
      logout: () => {
        const roleStore = useRoleStore.getState()
        roleStore.clearRoles()
        set({ user: null, isAuthenticated: false, token: null })
      },
      clearAuth: () => {
        const roleStore = useRoleStore.getState()
        roleStore.clearRoles()
        set({ user: null, isAuthenticated: false, token: null })
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
)

