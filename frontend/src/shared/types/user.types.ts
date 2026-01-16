/**
 * User Type Definitions
 * Matches backend Prisma schema
 * See: Documentation/BACKEND_API_SPEC.md Section 2.1 - Users
 */

export type UserRole =
  | 'tenant'
  | 'landlord'
  | 'realtor'
  | 'admin'
  | 'service_provider'
  | 'artisan'
  | 'property_manager'
  | 'handyman'
  | 'homerunner'

export type UserStatus = 'active' | 'suspended' | 'inactive' | 'pending_verification'

export type Gender = 'male' | 'female' | 'other'

export type BackgroundCheckStatus = 'pending' | 'submitted' | 'verified' | 'rejected'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  phoneCountryCode?: string // default: '+234'
  nationality?: string // default: 'Nigeria'
  dateOfBirth?: string | Date
  gender?: Gender
  roles: UserRole[]
  preferredRole?: UserRole
  profilePicture?: string
  avatar?: string // Alias for profilePicture
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isBackgroundChecked?: boolean
  backgroundCheckStatus?: BackgroundCheckStatus
  backgroundCheckData?: Record<string, unknown>
  status?: UserStatus
  averageRating?: number
  ratingCount?: number
  pointsBalance?: number
  lifetimePoints?: number
  createdAt: string | Date
  updatedAt: string | Date
  lastLoginAt?: string | Date
}

// Backward compatibility - allow old field names
export interface LegacyUser extends Omit<User, 'isEmailVerified' | 'isPhoneVerified'> {
  emailVerified: boolean
  phoneVerified: boolean
}
