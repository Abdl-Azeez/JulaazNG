/**
 * Authentication Mock Data
 * Matches: /api/v1/auth endpoints
 * See: Documentation/BACKEND_API_SPEC.md Section 3.1
 */

import { User } from '@/shared/types/user.types'
import { ApiResponse } from '@/shared/types/common.types'

// Sample users matching backend User schema
export const mockUsers: Record<string, User> = {
  tenant1: {
    id: 'user-tenant-001',
    firstName: 'Chioma',
    lastName: 'Nwosu',
    email: 'chioma.nwosu@example.com',
    phoneNumber: '+2348012345678',
    roles: ['tenant'],
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma',
    emailVerified: true,
    phoneVerified: true,
    status: 'active',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-12-20T15:30:00Z'),
  },
  landlord1: {
    id: 'user-landlord-001',
    firstName: 'Adebayo',
    lastName: 'Johnson',
    email: 'adebayo.johnson@example.com',
    phoneNumber: '+2348034567890',
    roles: ['landlord'],
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo',
    emailVerified: true,
    phoneVerified: true,
    status: 'active',
    createdAt: new Date('2023-06-10T08:00:00Z'),
    updatedAt: new Date('2024-12-27T12:00:00Z'),
  },
  multiRole1: {
    id: 'user-multi-001',
    firstName: 'Amina',
    lastName: 'Mohammed',
    email: 'amina.mohammed@example.com',
    phoneNumber: '+2348056789012',
    roles: ['tenant', 'landlord', 'service_provider'],
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amina',
    emailVerified: true,
    phoneVerified: true,
    status: 'active',
    createdAt: new Date('2023-03-20T14:00:00Z'),
    updatedAt: new Date('2024-12-28T09:00:00Z'),
  },
  handyman1: {
    id: 'user-handyman-001',
    firstName: 'Kunle',
    lastName: 'Balogun',
    email: 'kunle.balogun@example.com',
    phoneNumber: '+2348078901234',
    roles: ['handyman'],
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kunle',
    emailVerified: true,
    phoneVerified: true,
    status: 'active',
    createdAt: new Date('2024-02-01T10:00:00Z'),
    updatedAt: new Date('2024-12-27T18:00:00Z'),
  },
  homerunner1: {
    id: 'user-homerunner-001',
    firstName: 'Grace',
    lastName: 'Eze',
    email: 'grace.eze@example.com',
    phoneNumber: '+2348090123456',
    roles: ['homerunner'],
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace',
    emailVerified: true,
    phoneVerified: true,
    status: 'active',
    createdAt: new Date('2024-01-10T12:00:00Z'),
    updatedAt: new Date('2024-12-26T16:00:00Z'),
  },
  admin1: {
    id: 'user-admin-001',
    firstName: 'Oluwaseun',
    lastName: 'Akinwale',
    email: 'seun.admin@julaaz.ng',
    phoneNumber: '+2348011111111',
    roles: ['admin'],
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seun',
    emailVerified: true,
    phoneVerified: true,
    status: 'active',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2024-12-28T10:00:00Z'),
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
      emailVerified: false,
      phoneVerified: false,
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
