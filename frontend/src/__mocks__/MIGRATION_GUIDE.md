# Mock to Real API Migration Guide

## Overview

This guide helps you transition from mock data to real API integration systematically.

## Pre-Migration Checklist

- [ ] Backend API is deployed and accessible
- [ ] API documentation matches implementation
- [ ] All required endpoints are functional
- [ ] Authentication/authorization is working
- [ ] CORS is configured correctly
- [ ] Environment variables are set

## Migration Steps

### Step 1: Update Environment Variables

```env
# .env.development
VITE_API_URL=http://localhost:3000/api/v1
VITE_USE_MOCKS=true  # Set to false when ready

# .env.production
VITE_API_URL=https://api.julaaz.ng/api/v1
VITE_USE_MOCKS=false
```

### Step 2: Create Real API Service Functions

Create files in `src/shared/lib/api/` matching the mock structure:

```typescript
// src/shared/lib/api/auth.api.ts
import { apiClient } from './client'
import { User, LoginCredentials } from '@/shared/types'

export const authApi = {
  async register(data: RegisterData) {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  async login(credentials: LoginCredentials) {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  async verifyOtp(data: { email: string; otp: string }) {
    const response = await apiClient.post('/auth/verify-otp', data)
    return response.data
  },

  async refreshToken(refreshToken: string) {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken })
    return response.data
  },

  async logout() {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
}
```

### Step 3: Update Imports Module by Module

**Before:**
```typescript
import { mockLoginResponse, findMockUser } from '@/__mocks__'

// In component
const handleLogin = async () => {
  await mockDelay(500)
  const user = findMockUser(email)
  if (user) {
    login(user, 'mock-token')
  }
}
```

**After:**
```typescript
import { authApi } from '@/shared/lib/api/auth.api'

// In component
const handleLogin = async () => {
  try {
    const response = await authApi.login({ emailOrPhone: email, password })
    if (response.success) {
      login(response.data.user, response.data.accessToken)
    }
  } catch (error) {
    // Handle error
  }
}
```

### Step 4: Module Migration Order (Recommended)

1. **Authentication** (blocks everything else)
   - `/auth/register`
   - `/auth/login`
   - `/auth/verify-otp`
   - `/auth/me`

2. **User Profile** (needed for most features)
   - `/users/me`
   - `/users/me/settings`

3. **Properties** (core feature)
   - `/properties` (list)
   - `/properties/:id` (details)
   - `/properties` (create - landlord)

4. **Bookings** (depends on properties)
   - `/bookings/viewing-request`
   - `/bookings/my-bookings`
   - `/bookings/applications` (landlord)

5. **Payments** (depends on bookings)
   - `/payments/initiate`
   - `/payments/verify`

6. **Messaging** (WebSocket + REST)
   - `/messaging/conversations`
   - `/messaging/conversations/:id/messages`
   - WebSocket connection

7. **Notifications**
   - `/notifications`
   - WebSocket events

8. **Services & Artisans**
9. **Admin Features**
10. **Analytics & Reporting**

### Step 5: Testing Each Module

For each module migrated:

```typescript
// Create integration test
describe('Properties API Integration', () => {
  it('should fetch properties list', async () => {
    const response = await propertiesApi.getProperties({ page: 1, limit: 20 })
    
    expect(response.success).toBe(true)
    expect(response.data.properties).toBeInstanceOf(Array)
    expect(response.data.pagination).toBeDefined()
  })

  it('should match expected response shape', async () => {
    const response = await propertiesApi.getProperties()
    const property = response.data.properties[0]
    
    // Verify all expected keys exist
    expect(property).toHaveProperty('id')
    expect(property).toHaveProperty('title')
    expect(property).toHaveProperty('price')
    expect(property).toHaveProperty('landlordId')
    // ... etc
  })
})
```

### Step 6: Error Handling

Add proper error handling for real API:

```typescript
import { AxiosError } from 'axios'

try {
  const response = await propertiesApi.getProperties(filters)
  setProperties(response.data.properties)
} catch (error) {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      logout()
      navigate('/login')
    } else if (error.response?.status === 404) {
      // Not found
      showError('Properties not found')
    } else if (error.response?.status >= 500) {
      // Server error
      showError('Server error. Please try again later.')
    } else {
      // Other errors
      showError(error.response?.data?.error?.message || 'An error occurred')
    }
  }
}
```

### Step 7: Remove Mock Imports

After successful migration of a module:

1. Remove mock imports from components
2. Update stores/hooks to use real API
3. Test thoroughly in development
4. Deploy to staging
5. Test in staging environment
6. Deploy to production

### Step 8: Final Cleanup

Once ALL modules are migrated:

```bash
# Remove the entire mocks folder
rm -rf src/__mocks__

# Remove from git
git rm -r src/__mocks__
git commit -m "Remove mock data - backend integration complete"
```

## Common Issues & Solutions

### Issue: Response shape doesn't match

**Problem:** Backend returns different keys than expected

**Solution:**
1. Check backend API documentation
2. Update TypeScript types in `src/shared/types/`
3. Add response transformers if needed:

```typescript
// Transform backend response to match frontend expectations
const transformProperty = (backendProperty: any): Property => ({
  id: backendProperty.property_id, // Snake case to camel case
  title: backendProperty.name,
  // ... map all fields
})
```

### Issue: Pagination format differs

**Problem:** Backend uses different pagination structure

**Solution:**
```typescript
// Create adapter
const adaptPagination = (backendPagination: any): PaginationMeta => ({
  page: backendPagination.current_page,
  limit: backendPagination.per_page,
  total: backendPagination.total_items,
  totalPages: backendPagination.total_pages,
  hasNext: backendPagination.has_next,
  hasPrevious: backendPagination.has_previous,
})
```

### Issue: Date formats

**Problem:** Backend returns date strings, frontend expects Date objects

**Solution:**
```typescript
// Add date parsing utility
const parseApiDates = <T>(obj: T): T => {
  if (!obj) return obj
  if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}/.test(obj)) {
    return new Date(obj) as any
  }
  if (Array.isArray(obj)) {
    return obj.map(parseApiDates) as any
  }
  if (typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = parseApiDates(value)
      return acc
    }, {} as any)
  }
  return obj
}

// Use in API client interceptor
apiClient.interceptors.response.use((response) => {
  response.data = parseApiDates(response.data)
  return response
})
```

## Validation Checklist per Module

Use this checklist for each module you migrate:

- [ ] All endpoint URLs match backend spec
- [ ] Request payloads match expected format
- [ ] Response shapes match TypeScript types
- [ ] Error responses are handled
- [ ] Loading states work correctly
- [ ] Success/error messages display properly
- [ ] Navigation after actions works
- [ ] Data refreshes when needed
- [ ] Pagination works (if applicable)
- [ ] Filters work (if applicable)
- [ ] Search works (if applicable)
- [ ] Real-time updates work (if applicable)
- [ ] File uploads work (if applicable)
- [ ] Authentication is maintained
- [ ] Role-based access works
- [ ] Tested in multiple browsers
- [ ] Tested on mobile devices
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] TypeScript builds without errors

## Rollback Plan

If issues arise after migration:

1. **Quick Rollback**
   ```typescript
   // In API service file
   const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'
   
   export const getProperties = async (filters) => {
     if (USE_MOCKS) {
       return mockGetProperties(filters)
     }
     return realGetProperties(filters)
   }
   ```

2. **Environment Variable**
   ```env
   VITE_USE_MOCKS=true  # Revert to mocks
   ```

3. **Git Revert**
   ```bash
   git revert <commit-hash>
   ```

## Success Criteria

Migration is complete when:
- ✅ All features work with real API
- ✅ No mock imports remain in code
- ✅ All tests pass
- ✅ Performance meets requirements
- ✅ Error handling is comprehensive
- ✅ Loading states are smooth
- ✅ Production deployment successful
- ✅ User acceptance testing passed
- ✅ `__mocks__/` folder deleted
- ✅ Documentation updated

---

**Remember:** Migrate incrementally, test thoroughly, and keep mocks available until 100% confident in the real API integration.
