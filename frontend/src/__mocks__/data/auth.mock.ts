/**
 * Authentication Mock Data
 * Matches: /api/v1/auth endpoints
 * See: Documentation/BACKEND_API_SPEC.md Section 3.1
 */

import { User } from '@/shared/types/user.types'
import { ApiResponse } from '@/shared/types/common.types'

// Sample users matching backend User schema (BACKEND_API_SPEC.md Section 2.1)
export const mockUsers: Record<string, User> = {
  tenant1: {
    id: 'user-tenant-001',
    firstName: 'Chioma',
    lastName: 'Nwosu',
    email: 'chioma.nwosu@example.com',
    phoneNumber: '+2348012345678',
    phoneCountryCode: '+234',
    nationality: 'Nigeria',
    dateOfBirth: new Date('1995-05-15'),
    gender: 'female',
    roles: ['tenant'],
    preferredRole: 'tenant',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma',
    isEmailVerified: true,
    isPhoneVerified: true,
    isBackgroundChecked: true,
    backgroundCheckStatus: 'verified',
    status: 'active',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-12-20T15:30:00Z'),
    lastLoginAt: new Date('2024-12-28T08:00:00Z'),
  },
  landlord1: {
    id: 'user-landlord-001',
    firstName: 'Adebayo',
    lastName: 'Johnson',
    email: 'adebayo.johnson@example.com',
    phoneNumber: '+2348034567890',
    phoneCountryCode: '+234',
    nationality: 'Nigeria',
    dateOfBirth: new Date('1980-03-22'),
    gender: 'male',
    roles: ['landlord'],
    preferredRole: 'landlord',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo',
    isEmailVerified: true,
    isPhoneVerified: true,
    isBackgroundChecked: true,
    backgroundCheckStatus: 'verified',
    status: 'active',
    createdAt: new Date('2023-06-10T08:00:00Z'),
    updatedAt: new Date('2024-12-27T12:00:00Z'),
    lastLoginAt: new Date('2024-12-28T09:30:00Z'),
  },
  multiRole1: {
    id: 'user-multi-001',
    firstName: 'Amina',
    lastName: 'Mohammed',
    email: 'amina.mohammed@example.com',
    phoneNumber: '+2348056789012',
    phoneCountryCode: '+234',
    nationality: 'Nigeria',
    dateOfBirth: new Date('1988-11-08'),
    gender: 'female',
    roles: ['tenant', 'landlord', 'service_provider'],
    preferredRole: 'tenant',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amina',
    isEmailVerified: true,
    isPhoneVerified: true,
    isBackgroundChecked: true,
    backgroundCheckStatus: 'verified',
    status: 'active',
    createdAt: new Date('2023-03-20T14:00:00Z'),
    updatedAt: new Date('2024-12-28T09:00:00Z'),
    lastLoginAt: new Date('2024-12-28T07:00:00Z'),
  },
  handyman1: {
    id: 'user-handyman-001',
    firstName: 'Kunle',
    lastName: 'Balogun',
    email: 'kunle.balogun@example.com',
    phoneNumber: '+2348078901234',
    phoneCountryCode: '+234',
    nationality: 'Nigeria',
    dateOfBirth: new Date('1992-07-30'),
    gender: 'male',
    roles: ['handyman'],
    preferredRole: 'handyman',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kunle',
    isEmailVerified: true,
    isPhoneVerified: true,
    isBackgroundChecked: true,
    backgroundCheckStatus: 'verified',
    status: 'active',
    createdAt: new Date('2024-02-01T10:00:00Z'),
    updatedAt: new Date('2024-12-27T18:00:00Z'),
    lastLoginAt: new Date('2024-12-27T18:00:00Z'),
  },
  homerunner1: {
    id: 'user-homerunner-001',
    firstName: 'Grace',
    lastName: 'Eze',
    email: 'grace.eze@example.com',
    phoneNumber: '+2348090123456',
    phoneCountryCode: '+234',
    nationality: 'Nigeria',
    dateOfBirth: new Date('1990-12-01'),
    gender: 'female',
    roles: ['homerunner'],
    preferredRole: 'homerunner',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace',
    isEmailVerified: true,
    isPhoneVerified: true,
    isBackgroundChecked: true,
    backgroundCheckStatus: 'verified',
    status: 'active',
    createdAt: new Date('2024-01-10T12:00:00Z'),
    updatedAt: new Date('2024-12-26T16:00:00Z'),
    lastLoginAt: new Date('2024-12-26T16:00:00Z'),
  },
  admin1: {
    id: 'user-admin-001',
    firstName: 'Oluwaseun',
    lastName: 'Akinwale',
    email: 'seun.admin@julaaz.ng',
    phoneNumber: '+2348011111111',
    phoneCountryCode: '+234',
    nationality: 'Nigeria',
    dateOfBirth: new Date('1985-01-15'),
    gender: 'male',
    roles: ['admin'],
    preferredRole: 'admin',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seun',
    isEmailVerified: true,
    isPhoneVerified: true,
    isBackgroundChecked: true,
    backgroundCheckStatus: 'verified',
    status: 'active',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2024-12-28T10:00:00Z'),
    lastLoginAt: new Date('2024-12-28T10:00:00Z'),
  },
}

// POST /register response
export const mockRegisterResponse: ApiResponse<{
  user: Partial<User>
  message: string
  otpSentTo: string
}> = {
  success: true,
  data: {
    user: {
      id: 'user-new-001',
      email: 'new.user@example.com',
      phoneNumber: '+2348012345678',
      roles: ['tenant'],
      isEmailVerified: false,
      isPhoneVerified: false,
      status: 'pending_verification',
    },
    message: 'Registration successful. Please verify your OTP.',
    otpSentTo: 'email',
  },
  timestamp: new Date().toISOString(),
}

// POST /verify-otp response
export const mockVerifyOtpResponse: ApiResponse<{
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}> = {
  success: true,
  data: {
    user: mockUsers.tenant1,
    accessToken: 'mock-jwt-access-token-' + Date.now(),
    refreshToken: 'mock-jwt-refresh-token-' + Date.now(),
    expiresIn: 900, // 15 minutes in seconds
  },
  timestamp: new Date().toISOString(),
}

// POST /login response (same structure as verify-otp)
export const mockLoginResponse: ApiResponse<{
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}> = {
  success: true,
  data: {
    user: mockUsers.multiRole1,
    accessToken: 'mock-jwt-access-token-' + Date.now(),
    refreshToken: 'mock-jwt-refresh-token-' + Date.now(),
    expiresIn: 900,
  },
  timestamp: new Date().toISOString(),
}

// POST /refresh-token response
export const mockRefreshTokenResponse: ApiResponse<{
  accessToken: string
  expiresIn: number
}> = {
  success: true,
  data: {
    accessToken: 'mock-jwt-refreshed-token-' + Date.now(),
    expiresIn: 900,
  },
  timestamp: new Date().toISOString(),
}

// GET /me response
export const mockMeResponse: ApiResponse<User> = {
  success: true,
  data: mockUsers.multiRole1,
  timestamp: new Date().toISOString(),
}

// Helper function to find user by email/phone
export const findMockUser = (identifier: string): User | undefined => {
  return Object.values(mockUsers).find(
    (user) => user.email === identifier || user.phoneNumber === identifier
  )
}

// Helper to create mock auth response
export const createMockAuthResponse = (
  user: User
): ApiResponse<{
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}> => ({
  success: true,
  data: {
    user,
    accessToken: 'mock-jwt-access-token-' + Date.now(),
    refreshToken: 'mock-jwt-refresh-token-' + Date.now(),
    expiresIn: 900,
  },
  timestamp: new Date().toISOString(),
})
