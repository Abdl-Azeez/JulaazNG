/**
 * Mock data for Sample Users & Authentication
 * Migrated from: shared/data/sample-users.ts
 * 
 * These test credentials are for development purposes only.
 */

import type { RoleType, UserRole } from '@/shared/store/role.store'

// ============================================================
// TYPES
// ============================================================
export interface SampleUser {
  id: string
  name: string
  email: string
  phone: string
  password: string
  roles: UserRole[]
  preferredRole?: RoleType
}

// ============================================================
// SAMPLE USERS FOR DEVELOPMENT
// ============================================================
export const sampleUsers: SampleUser[] = [
  {
    id: 'tenant-001',
    name: 'Tosin Adeyemi',
    email: 'tenant@julaaz.com',
    phone: '08010000001',
    password: 'tenant123',
    roles: [
      {
        type: 'tenant',
        priority: 'primary',
        lastUsed: true,
      },
    ],
    preferredRole: 'tenant',
  },
  {
    id: 'landlord-001',
    name: 'Femi Ogunleye',
    email: 'landlord@julaaz.com',
    phone: '08010000002',
    password: 'landlord123',
    roles: [
      {
        type: 'landlord',
        priority: 'primary',
        lastUsed: true,
      },
    ],
    preferredRole: 'landlord',
  },
  {
    id: 'hybrid-001',
    name: 'Chioma Nwosu',
    email: 'hybrid@julaaz.com',
    phone: '08010000003',
    password: 'hybrid123',
    roles: [
      {
        type: 'tenant',
        priority: 'primary',
        lastUsed: true,
      },
      {
        type: 'landlord',
        priority: 'secondary',
        lastUsed: false,
      },
    ],
    preferredRole: 'tenant',
  },
  {
    id: 'handyman-001',
    name: 'Kunle Balogun',
    email: 'handyman@julaaz.com',
    phone: '08010000004',
    password: 'handyman123',
    roles: [
      {
        type: 'handyman',
        priority: 'primary',
        lastUsed: true,
      },
    ],
    preferredRole: 'handyman',
  },
  {
    id: 'tenant-handyman-001',
    name: 'Emeka Okoro',
    email: 'tenant-handyman@julaaz.com',
    phone: '08010000005',
    password: 'tenant-handyman123',
    roles: [
      {
        type: 'tenant',
        priority: 'primary',
        lastUsed: true,
      },
      {
        type: 'handyman',
        priority: 'secondary',
        lastUsed: false,
      },
    ],
    preferredRole: 'tenant',
  },
  {
    id: 'homerunner-001',
    name: 'Adebayo Johnson',
    email: 'homerunner@julaaz.com',
    phone: '08010000006',
    password: 'homerunner123',
    roles: [
      {
        type: 'homerunner',
        priority: 'primary',
        lastUsed: true,
      },
    ],
    preferredRole: 'homerunner',
  },
  {
    id: 'admin-001',
    name: 'Super Admin',
    email: 'admin@julaaz.com',
    phone: '08010000007',
    password: 'admin123',
    roles: [
      {
        type: 'admin',
        priority: 'primary',
        lastUsed: true,
      },
    ],
    preferredRole: 'admin',
  },
  {
    id: 'admin-homerunner-001',
    name: 'Admin Homerunner',
    email: 'admin-homerunner@julaaz.com',
    phone: '08010000008',
    password: 'admin-homerunner123',
    roles: [
      {
        type: 'admin',
        priority: 'primary',
        lastUsed: true,
      },
      {
        type: 'homerunner',
        priority: 'secondary',
        lastUsed: false,
      },
    ],
    preferredRole: 'admin',
  },
]

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
export const findSampleUser = (identifier: string): SampleUser | undefined => {
  const normalized = identifier.trim().toLowerCase()
  return sampleUsers.find(
    (user) =>
      user.email.toLowerCase() === normalized ||
      user.phone.replace(/\s/g, '') === identifier.replace(/\s/g, '')
  )
}

export const getSampleUserByRole = (role: RoleType): SampleUser | undefined => {
  return sampleUsers.find((user) => user.preferredRole === role)
}

export const getAllSampleRoles = (): RoleType[] => {
  return [...new Set(sampleUsers.flatMap((u) => u.roles.map((r) => r.type)))]
}

// Alias for backward compatibility
export const mockSampleUsers = sampleUsers
