# Quick Reference: Scattered Mock Files to Replace

This document lists all the scattered mock data files found in the frontend that should be migrated to use centralized mocks from `@/__mocks__`.

## 📍 Files to Update

### 1. My Bookings Page
**Location**: `pages/my-bookings/data/sample-bookings.ts`  
**Replace with**: `import { mockMyBookingsResponse } from '@/__mocks__'`

### 2. My Services Page
**Location**: `pages/my-services/data/sample-service-bookings.ts`  
**Replace with**: `import { mockMyServicesResponse } from '@/__mocks__'`

### 3. Notifications Page
**Location**: `pages/notifications/data/sample-notifications.ts`  
**Replace with**: `import { mockNotificationsResponse } from '@/__mocks__'`

### 4. Events Page
**Location**: `pages/events/data/sample-events.ts`  
**Replace with**: Create events.mock.ts or use `mockNotificationsResponse` for event-like data

### 5. Home Page
**Location**: `pages/home/data/sample-properties.ts`  
**Replace with**: `import { mockPropertiesListResponse } from '@/__mocks__'`

### 6. Admin Pages
**Location**: `pages/admin/data/sample-admin-data.ts`  
**Replace with**: `import { mockAdminAnalyticsResponse, mockAdminUsersResponse } from '@/__mocks__'`

### 7. Landlord Pages
**Location**: 
- `pages/landlord/data/sample-properties.ts`
- `pages/landlord/data/sample-applications.ts`
- `pages/landlord/data/sample-earnings.ts`

**Replace with**: 
```typescript
import { 
  mockLandlordPropertiesResponse,
  mockLandlordApplicationsResponse,
  mockLandlordEarningsResponse
} from '@/__mocks__'
```

### 8. Auth Pages
**Locations**:
- `pages/auth/verify-otp/data/...`
- `pages/auth/signup/data/...`
- `pages/auth/login/data/...`

**Replace with**: 
```typescript
import { 
  mockLoginResponse,
  mockRegisterResponse,
  mockVerifyOtpResponse
} from '@/__mocks__'
```

## 🔄 Migration Pattern

For each file:

### Step 1: Locate the scattered mock import
```typescript
// OLD
import { sampleProperties } from './data/sample-properties'
```

### Step 2: Replace with centralized mock
```typescript
// NEW
import { mockPropertiesListResponse } from '@/__mocks__'
```

### Step 3: Update the usage
```typescript
// OLD
const properties = sampleProperties

// NEW (API Response structure)
const { data } = mockPropertiesListResponse
const properties = data.properties
```

### Step 4: Remove the old file
```bash
rm pages/home/data/sample-properties.ts
```

## 📋 Complete Mapping Guide

| Old Location | Old Variable | New Import | New Variable |
|-------------|--------------|------------|--------------|
| `pages/home/data/sample-properties.ts` | `sampleProperties` | `mockPropertiesListResponse` | `data.properties` |
| `pages/my-bookings/data/sample-bookings.ts` | `sampleBookings` | `mockMyBookingsResponse` | `data.bookings` |
| `pages/my-services/data/sample-service-bookings.ts` | `sampleServices` | `mockMyServicesResponse` | `data.bookings` |
| `pages/notifications/data/sample-notifications.ts` | `sampleNotifications` | `mockNotificationsResponse` | `data.notifications` |
| `pages/landlord/data/sample-properties.ts` | `landlordProperties` | `mockLandlordPropertiesResponse` | `data.properties` |
| `pages/landlord/data/sample-applications.ts` | `applications` | `mockLandlordApplicationsResponse` | `data.applications` |
| `pages/landlord/data/sample-earnings.ts` | `earnings` | `mockLandlordEarningsResponse` | `data` |
| `pages/admin/data/sample-admin-data.ts` | `adminData` | `mockAdminAnalyticsResponse` | `data` |
| `pages/auth/*/data/*` | various | `mockLoginResponse`, etc. | `data` |

## 🚀 Quick Migration Script

Create a script to automate the migration:

```typescript
// scripts/migrate-mocks.ts
import fs from 'fs'
import path from 'path'

const migrations = [
  {
    file: 'pages/home/HomePage.tsx',
    oldImport: "import { sampleProperties } from './data/sample-properties'",
    newImport: "import { mockPropertiesListResponse } from '@/__mocks__'",
    oldUsage: 'sampleProperties',
    newUsage: 'mockPropertiesListResponse.data.properties',
  },
  // Add more migrations...
]

migrations.forEach((migration) => {
  const filePath = path.join(process.cwd(), 'src', migration.file)
  let content = fs.readFileSync(filePath, 'utf-8')
  
  // Replace import
  content = content.replace(migration.oldImport, migration.newImport)
  
  // Replace usage (be careful with this - might need manual review)
  // content = content.replace(new RegExp(migration.oldUsage, 'g'), migration.newUsage)
  
  fs.writeFileSync(filePath, content)
  console.log(`✅ Migrated ${migration.file}`)
})
```

## ✅ Verification Checklist

After migration:

- [ ] All pages load without errors
- [ ] Data displays correctly
- [ ] TypeScript has no errors
- [ ] API response structure is consistent
- [ ] Old mock files are deleted
- [ ] No more scattered data directories

## 🎯 Priority Order

1. **High Priority** (User-facing pages)
   - Auth pages (login, signup, verify-otp)
   - Home page
   - My Bookings
   - My Services
   - Notifications

2. **Medium Priority** (Role-specific)
   - Landlord dashboard
   - Landlord properties
   - Landlord applications

3. **Low Priority** (Admin)
   - Admin dashboard
   - Admin users
   - Admin reports

---

**Note**: This is a safe, non-breaking migration. Old code continues to work while you gradually migrate to centralized mocks.
