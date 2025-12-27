# Mock Data & API Layer

**⚠️ TEMPORARY DEVELOPMENT DATA - TO BE REPLACED WITH REAL API CALLS**

This folder contains all mock data and API response structures used during frontend development before the backend API is ready.

## Purpose

- Simulate backend API responses with realistic data structures
- Match exact response keys from backend API specification
- Enable frontend development without backend dependency
- Easy to remove/replace when real API is integrated

## Structure

```
__mocks__/
├── README.md                    # This file
├── index.ts                     # Main export file - import all mocks from here
├── validate.ts                  # Validation utilities
├── data/                        # Mock data matching API response shapes
│   ├── auth.mock.ts             # Authentication responses
│   ├── users.mock.ts            # Sample users for dev/testing
│   ├── properties.mock.ts       # Property listings (sampleProperties, mockPropertiesListResponse)
│   ├── property-details.mock.ts # Property details (samplePropertyDetails - entity-style)
│   ├── bookings.mock.ts         # Booking & application data (samplePropertyBookings)
│   ├── services.mock.ts         # Service listings & categories (serviceCategories)
│   ├── payments.mock.ts         # Payment data
│   ├── messages.mock.ts         # Messaging data (sampleConversations, sampleMessages)
│   ├── notifications.mock.ts    # Notifications data
│   ├── landlord.mock.ts         # Landlord dashboard data
│   ├── homerunner.mock.ts       # Homerunner data (inspections, viewings, earnings)
│   ├── admin.mock.ts            # Admin dashboard data
│   ├── favourites.mock.ts       # Favourites data (sampleFavourites)
│   ├── events.mock.ts           # Events/calendar data (sampleEvents)
│   └── tenant.mock.ts           # Tenant payments & agreements
└── api/                         # Mock API functions (to be replaced)
    └── ...
```

## Response Shape Convention

All mock data follows the backend API response structure:

```typescript
interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: PaginationMeta    // For paginated endpoints
  timestamp: string
}
```

## Usage

### In Components/Pages:

```typescript
// ❌ DON'T import from scattered locations
import { sampleProperties } from '@/pages/home/data/sample-properties'

// ✅ DO import from centralized mocks
import { sampleProperties } from '@/__mocks__/data/properties.mock'
// OR
import { sampleProperties } from '@/__mocks__'
```

### With API Functions:

```typescript
// Current (TEMPORARY):
import { getProperties } from '@/__mocks__/api/properties.api.mock'

// Future (when backend is ready):
import { getProperties } from '@/shared/lib/api/properties'
```

## Migration Plan

### Phase 1: Development (Current)
- Use mock data from `__mocks__/`
- Frontend development continues independently

### Phase 2: Backend Integration
1. Replace mock API functions with real API calls
2. Update imports from `__mocks__/api/*` to `shared/lib/api/*`
3. Verify response shapes match expectations
4. Test with real backend data

### Phase 3: Cleanup
- Delete entire `__mocks__/` folder
- Remove all mock-related imports
- Update documentation

## Key Points

1. **All mock data keys MUST match backend API specification**
2. **Use TypeScript types from `shared/types/`**
3. **Import mocks only from `__mocks__/index.ts`**
4. **Never commit real user data to mocks**
5. **Document any deviations from API spec**

## When to Update

- When backend API specification changes
- When adding new features requiring mock data
- When response shape mismatches are discovered during integration

---

**Last Updated:** December 28, 2025  
**Status:** Active - Remove when backend integration is complete
