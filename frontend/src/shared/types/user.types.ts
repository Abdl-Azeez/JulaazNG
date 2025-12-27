/**
 * User Type Definitions
 * Matches backend Prisma schema
 */

export type UserRole =
  | 'TENANT'
  | 'LANDLORD'
  | 'SERVICE_PROVIDER'
  | 'ARTISAN'
  | 'PROPERTY_MANAGER'
  | 'HANDYMAN'
  | 'HOMERUNNER'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  // Allow lowercase variants
  | 'tenant'
  | 'landlord'
  | 'service_provider'
  | 'artisan'
  | 'property_manager'
  | 'handyman'
  | 'homerunner'
  | 'admin'

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'PENDING_VERIFICATION' | 'active' | 'suspended' | 'inactive' | 'pending_verification'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  roles: string[]
  profilePicture?: string
  avatar?: string // Alias for profilePicture
  emailVerified: boolean
  phoneVerified: boolean
  status?: UserStatus | string
  createdAt: string | Date
  updatedAt: string | Date
}
