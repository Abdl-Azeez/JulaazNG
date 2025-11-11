import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type RoleType =
  | 'tenant'
  | 'landlord'
  | 'service_provider'
  | 'artisan'
  | 'property_manager'
  | 'admin'
  | 'handyman'
  | 'homerunner'

export interface UserRole {
  type: RoleType
  priority?: 'primary' | 'secondary'
  lastUsed?: boolean
}

interface RoleState {
  roles: UserRole[]
  activeRole: RoleType | null
  suggestedRole: RoleType | null
  isRoleSwitcherOpen: boolean

  setRoles: (roles: UserRole[]) => void
  setActiveRole: (role: RoleType) => void
  clearRoles: () => void
  openRoleSwitcher: () => void
  closeRoleSwitcher: () => void
  getPreferredRole: () => RoleType | null
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      roles: [],
      activeRole: null,
      suggestedRole: null,
      isRoleSwitcherOpen: false,

      setRoles: (roles) => {
        const preferred = roles.find((r) => r.lastUsed)?.type ?? roles[0]?.type ?? null
        set({
          roles,
          suggestedRole: preferred,
          // Do not override activeRole if already chosen in-session
          activeRole: get().activeRole ?? preferred,
        })
      },

      setActiveRole: (role) => {
        // mark lastUsed on the role selected
        const updated = get().roles.map((r) => ({
          ...r,
          lastUsed: r.type === role,
        }))
        set({ activeRole: role, roles: updated, isRoleSwitcherOpen: false })
      },

      clearRoles: () => set({ roles: [], activeRole: null, suggestedRole: null }),

      openRoleSwitcher: () => set({ isRoleSwitcherOpen: true }),
      closeRoleSwitcher: () => set({ isRoleSwitcherOpen: false }),

      getPreferredRole: () => {
        const { roles } = get()
        return roles.find((r) => r.lastUsed)?.type ?? roles[0]?.type ?? null
      },
    }),
    {
      name: 'role-storage',
      getStorage: () => localStorage,
      // Only persist role session info; avoid persisting ephemeral modal flags
      partialize: (state) => ({
        roles: state.roles,
        activeRole: state.activeRole,
        suggestedRole: state.suggestedRole,
      }),
    }
  )
)


