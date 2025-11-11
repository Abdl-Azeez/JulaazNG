import type { RoleType, UserRole } from '@/shared/store/role.store'

export interface SampleUser {
  id: string
  name: string
  email: string
  phone: string
  password: string
  roles: UserRole[]
  preferredRole?: RoleType
}

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
]

export const findSampleUser = (identifier: string) => {
  const normalized = identifier.trim().toLowerCase()
  return sampleUsers.find(
    (user) =>
      user.email.toLowerCase() === normalized ||
      user.phone.replace(/\s/g, '') === identifier.replace(/\s/g, '')
  )
}


