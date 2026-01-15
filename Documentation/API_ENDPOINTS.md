# 📋 JulaazNG API Endpoints Reference
## Quick Reference Guide for All API Endpoints

> **For comprehensive backend development guide (architecture, database schema, implementation details), see [BACKEND_API_SPEC.md](BACKEND_API_SPEC.md)**

---

## 📊 API Summary Overview

| Module | Endpoints | Priority | Status |
|--------|-----------|----------|--------|
| Authentication | 12 | 🔴 Critical | Documented |
| Users/Profile | 18 | 🔴 Critical | Documented |
| Properties | 24 | 🔴 Critical | Documented |
| Bookings | 20 | 🔴 Critical | Documented |
| Agreements | 6 | 🔴 Critical | Documented |
| Payments | 14 | 🔴 Critical | Documented |
| Messaging | 10 | 🟡 High | Documented |
| Notifications | 10 | 🟡 High | Documented |
| Favourites | 6 | 🟢 Medium | Documented |
| Services | 14 | 🟡 High | Documented |
| Artisans | 18 | 🟡 High | Documented |
| Reviews | 10 | 🟢 Medium | Documented |
| Landlord Dashboard | 14 | 🟢 Medium | Documented |
| Handyman | 16 | 🟢 Medium | Documented |
| Homerunner | 16 | 🟢 Medium | Documented |
| Property Management | 14 | 🟢 Medium | Documented |
| Admin | 69 | 🟡 High | Documented |
| Events/Calendar | 8 | 🟢 Medium | Documented |
| Utilities | 10 | 🟢 Medium | Documented |
| **TOTAL** | **~289** | | |

---

## 🎭 User Roles Overview

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Tenant** | Property seekers & renters | Search, book, pay rent, review |
| **Landlord** | Property owners | List properties, manage applications, track earnings |
| **Service Provider** | Cleaning, moving, maintenance services | Offer services, manage bookings |
| **Artisan** | Skilled tradespeople | Electrical, plumbing, carpentry services |
| **Property Manager** | Manages properties for landlords | Tenant management, maintenance, rent collection |
| **Handyman** | General repair & maintenance | Job assignments, checklists, scheduling |
| **Homerunner** | Field agents for viewings & inspections | Conduct inspections, manage viewings |
| **Admin** | Platform administrators | User management, approvals, analytics |
| **Super Admin** | Full platform control | All admin permissions + system config |

---

## 🔐 1. Authentication APIs (`/api/v1/auth`)

| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 1 | POST | `/register` | Register new user | No |
| 2 | POST | `/verify-otp` | Verify OTP code | No |
| 3 | POST | `/resend-otp` | Resend OTP code | No |
| 4 | POST | `/login` | Login with email/phone + password | No |
| 5 | POST | `/login/password` | Password-only login step | No |
| 6 | POST | `/social/google` | Google OAuth login | No |
| 7 | POST | `/social/facebook` | Facebook OAuth login | No |
| 8 | POST | `/refresh-token` | Refresh access token | No |
| 9 | POST | `/logout` | Logout user | Yes |
| 10 | POST | `/forgot-password` | Request password reset | No |
| 11 | POST | `/reset-password` | Reset password with token | No |
| 12 | GET | `/me` | Get current authenticated user | Yes |

---

## 👤 2. Users & Profile APIs (`/api/v1/users`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/me` | Get current user profile | Yes | All |
| 2 | PUT | `/me` | Update user profile | Yes | All |
| 3 | POST | `/me/avatar` | Upload profile photo | Yes | All |
| 4 | DELETE | `/me/avatar` | Remove profile photo | Yes | All |
| 5 | PUT | `/me/password` | Change password | Yes | All |
| 6 | GET | `/me/settings` | Get user settings | Yes | All |
| 7 | PUT | `/me/settings` | Update settings | Yes | All |
| 8 | PUT | `/me/notifications/preferences` | Update notification preferences | Yes | All |
| 9 | POST | `/me/2fa/enable` | Enable 2FA | Yes | All |
| 10 | DELETE | `/me/2fa/disable` | Disable 2FA | Yes | All |
| 11 | POST | `/me/background-check` | Submit background check | Yes | All |
| 12 | GET | `/me/background-check/status` | Get verification status | Yes | All |
| 13 | POST | `/me/documents` | Upload verification documents | Yes | All |
| 14 | GET | `/me/documents` | Get uploaded documents | Yes | All |
| 15 | DELETE | `/me/documents/:id` | Delete document | Yes | All |
| 16 | POST | `/me/roles/add` | Request additional role | Yes | All |
| 17 | PUT | `/me/preferred-role` | Set preferred role | Yes | All |
| 18 | DELETE | `/me` | Delete account | Yes | All |

---

## 🏠 3. Properties APIs (`/api/v1/properties`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/` | List properties (filters, pagination) | No | Public |
| 2 | GET | `/search` | Advanced search | No | Public |
| 3 | GET | `/featured` | Get featured properties | No | Public |
| 4 | GET | `/nearby` | Location-based nearby properties | No | Public |
| 5 | GET | `/filters` | Get available filter options | No | Public |
| 6 | GET | `/:id` | Get property details | No | Public |
| 7 | GET | `/:id/availability` | Check availability (shortlet) | No | Public |
| 8 | GET | `/:id/amenities` | Get property amenities | No | Public |
| 9 | GET | `/:id/images` | Get property images | No | Public |
| 10 | GET | `/:id/reviews` | Get property reviews | No | Public |
| 11 | GET | `/:id/similar` | Get similar properties | No | Public |
| 12 | POST | `/:id/viewing-request` | Request property viewing | Yes | Tenant |
| 13 | POST | `/:id/favourite` | Add to favourites | Yes | All |
| 14 | DELETE | `/:id/favourite` | Remove from favourites | Yes | All |
| 15 | POST | `/:id/report` | Report property listing | Yes | All |
| 16 | POST | `/` | Create property | Yes | Landlord |
| 17 | PUT | `/:id` | Update property | Yes | Landlord |
| 18 | DELETE | `/:id` | Delete property | Yes | Landlord |
| 19 | POST | `/:id/images` | Upload property images | Yes | Landlord |
| 20 | DELETE | `/:id/images/:imageId` | Delete property image | Yes | Landlord |
| 21 | PUT | `/:id/status` | Update property status | Yes | Landlord |
| 22 | PUT | `/:id/pricing` | Update property pricing | Yes | Landlord |
| 23 | GET | `/:id/analytics` | Get property analytics | Yes | Landlord |
| 24 | GET | `/:id/tenants` | Get property tenants | Yes | Landlord |

---

## 📅 4. Bookings APIs (`/api/v1/bookings`)

### Property Bookings (Tenants)
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/my-bookings` | Get tenant's property bookings | Yes | Tenant |
| 2 | GET | `/:id` | Get booking details | Yes | Tenant/Landlord |
| 3 | POST | `/viewing-request` | Submit viewing request | Yes | Tenant |
| 4 | PUT | `/:id/cancel` | Cancel booking | Yes | Tenant |
| 5 | POST | `/:id/reschedule` | Reschedule viewing | Yes | Tenant |
| 6 | POST | `/:id/report` | Report issue with booking | Yes | Tenant |
| 7 | GET | `/:id/timeline` | Get booking timeline | Yes | Tenant/Landlord |

### Applications (Landlords)
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 8 | GET | `/applications` | Get tenant applications | Yes | Landlord |
| 9 | GET | `/applications/:id` | Get application details | Yes | Landlord |
| 10 | PATCH | `/applications/:id/approve` | Approve application | Yes | Landlord |
| 11 | PATCH | `/applications/:id/reject` | Reject application | Yes | Landlord |
| 12 | POST | `/applications/:id/request-documents` | Request additional docs | Yes | Landlord |
| 13 | POST | `/applications/:id/schedule-viewing` | Schedule a viewing | Yes | Landlord |

### Service Bookings
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 14 | GET | `/services` | Get user's service bookings | Yes | All |
| 15 | GET | `/services/:id` | Get service booking details | Yes | All |
| 16 | POST | `/services` | Create service booking | Yes | All |
| 17 | PUT | `/services/:id/cancel` | Cancel service booking | Yes | All |
| 18 | POST | `/services/:id/reschedule` | Reschedule service | Yes | All |
| 19 | POST | `/services/:id/review` | Review service | Yes | All |
| 20 | POST | `/services/:id/report` | Report service issue | Yes | All |

---

## 📝 5. Agreements APIs (`/api/v1/agreements`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/` | List user's agreements | Yes | Tenant/Landlord |
| 2 | GET | `/:id` | Get agreement details | Yes | Tenant/Landlord |
| 3 | GET | `/:id/document` | Download agreement PDF | Yes | Tenant/Landlord |
| 4 | POST | `/:id/sign` | Sign agreement | Yes | Tenant |
| 5 | POST | `/:id/reject` | Reject agreement terms | Yes | Tenant |
| 6 | POST | `/` | Create agreement (system) | Yes | Landlord |

---

## 💰 6. Payments APIs (`/api/v1/payments`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/` | List user's payments | Yes | All |
| 2 | GET | `/upcoming` | Get upcoming payments | Yes | Tenant |
| 3 | GET | `/history` | Get payment history | Yes | All |
| 4 | GET | `/:id` | Get payment details | Yes | All |
| 5 | GET | `/:id/receipt` | Download payment receipt | Yes | All |
| 6 | POST | `/initiate` | Initiate payment | Yes | All |
| 7 | POST | `/verify` | Verify payment status | Yes | All |
| 8 | POST | `/webhook/paystack` | Paystack webhook | No | System |
| 9 | POST | `/webhook/flutterwave` | Flutterwave webhook | No | System |

### Landlord Earnings
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 10 | GET | `/earnings` | Get earnings summary | Yes | Landlord |
| 11 | GET | `/earnings/breakdown` | Detailed earnings by property | Yes | Landlord |
| 12 | GET | `/earnings/history` | Historical earnings | Yes | Landlord |
| 13 | POST | `/earnings/withdraw` | Request withdrawal | Yes | Landlord |
| 14 | GET | `/earnings/pending` | Get pending payouts | Yes | Landlord |

---

## 💬 7. Messaging APIs (`/api/v1/messaging`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/conversations` | List conversations | Yes | All |
| 2 | GET | `/conversations/:id` | Get conversation details | Yes | All |
| 3 | GET | `/conversations/:id/messages` | Get messages (paginated) | Yes | All |
| 4 | POST | `/conversations` | Start new conversation | Yes | All |
| 5 | POST | `/conversations/:id/messages` | Send message | Yes | All |
| 6 | PUT | `/messages/:id/read` | Mark message as read | Yes | All |
| 7 | DELETE | `/conversations/:id` | Archive/delete conversation | Yes | All |
| 8 | GET | `/conversations/:id/participants` | Get conversation participants | Yes | All |
| 9 | POST | `/conversations/:id/typing` | Send typing indicator | Yes | All |
| 10 | GET | `/unread-count` | Get total unread messages | Yes | All |

---

## 🔔 8. Notifications APIs (`/api/v1/notifications`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/` | List notifications (paginated) | Yes | All |
| 2 | GET | `/unread-count` | Get unread count | Yes | All |
| 3 | GET | `/:id` | Get notification details | Yes | All |
| 4 | PUT | `/:id/read` | Mark as read | Yes | All |
| 5 | PUT | `/mark-all-read` | Mark all as read | Yes | All |
| 6 | DELETE | `/:id` | Delete notification | Yes | All |
| 7 | DELETE | `/clear-all` | Clear all notifications | Yes | All |
| 8 | GET | `/settings` | Get notification preferences | Yes | All |
| 9 | PUT | `/settings` | Update notification preferences | Yes | All |
| 10 | POST | `/subscribe` | Subscribe to push notifications | Yes | All |

---

## ⭐ 9. Favourites APIs (`/api/v1/favourites`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/` | List all favourites | Yes | All |
| 2 | GET | `/properties` | List favourited properties | Yes | All |
| 3 | GET | `/services` | List favourited services | Yes | All |
| 4 | GET | `/providers` | List favourited providers | Yes | All |
| 5 | POST | `/` | Add to favourites | Yes | All |
| 6 | DELETE | `/:id` | Remove from favourites | Yes | All |

---

## 🧹 10. Services APIs (`/api/v1/services`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/categories` | Get service categories | No | Public |
| 2 | GET | `/category/:slug` | Get services by category | No | Public |
| 3 | GET | `/` | List services with filters | No | Public |
| 4 | GET | `/search` | Search services | No | Public |
| 5 | GET | `/:id` | Get service details | No | Public |
| 6 | GET | `/providers` | List service providers | No | Public |
| 7 | GET | `/providers/:id` | Get provider profile | No | Public |
| 8 | GET | `/providers/:id/reviews` | Get provider reviews | No | Public |
| 9 | GET | `/providers/:id/availability` | Get provider availability | No | Public |
| 10 | POST | `/` | Create service | Yes | Provider |
| 11 | PUT | `/:id` | Update service | Yes | Provider |
| 12 | DELETE | `/:id` | Delete service | Yes | Provider |
| 13 | PUT | `/:id/availability` | Update service availability | Yes | Provider |
| 14 | GET | `/how-it-works` | Get service workflow info | No | Public |

---

## 🔧 11. Artisans APIs (`/api/v1/artisans`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/` | List artisans with filters | No | Public |
| 2 | GET | `/categories` | Get artisan categories | No | Public |
| 3 | GET | `/:id` | Get artisan profile | No | Public |
| 4 | GET | `/:id/reviews` | Get artisan reviews | No | Public |
| 5 | GET | `/:id/portfolio` | Get artisan portfolio | No | Public |
| 6 | GET | `/:id/availability` | Get artisan availability | No | Public |
| 7 | POST | `/register` | Register as artisan | Yes | User |
| 8 | PUT | `/profile` | Update artisan profile | Yes | Artisan |
| 9 | PUT | `/profile/availability` | Update availability | Yes | Artisan |
| 10 | POST | `/service-request` | Create service request | Yes | All |
| 11 | GET | `/matching/:requestId` | Get matched artisans | Yes | All |
| 12 | POST | `/diagnostic/:bookingId/pay` | Pay diagnostic fee | Yes | All |
| 13 | GET | `/quotes/:requestId` | Get service quotes | Yes | All |
| 14 | POST | `/quotes/:quoteId/accept` | Accept service quote | Yes | All |
| 15 | GET | `/bookings` | Get artisan's bookings | Yes | Artisan |
| 16 | PATCH | `/bookings/:id/status` | Update booking status | Yes | Artisan |
| 17 | POST | `/bookings/:id/photos` | Upload before/after photos | Yes | Artisan |
| 18 | POST | `/bookings/:id/quote` | Submit service quote | Yes | Artisan |

---

## ⭐ 12. Reviews APIs (`/api/v1/reviews`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/property/:id` | Get property reviews | No | Public |
| 2 | GET | `/user/:id` | Get user reviews | No | Public |
| 3 | GET | `/service/:id` | Get service reviews | No | Public |
| 4 | GET | `/artisan/:id` | Get artisan reviews | No | Public |
| 5 | GET | `/provider/:id` | Get provider reviews | No | Public |
| 6 | POST | `/` | Create review | Yes | All |
| 7 | PUT | `/:id` | Update review | Yes | All |
| 8 | DELETE | `/:id` | Delete review | Yes | All |
| 9 | POST | `/:id/response` | Respond to review | Yes | Owner |
| 10 | POST | `/:id/report` | Report review | Yes | All |

---

## 🏢 13. Landlord Dashboard APIs (`/api/v1/landlord`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/dashboard` | Get dashboard overview | Yes | Landlord |
| 2 | GET | `/dashboard/stats` | Get quick stats | Yes | Landlord |
| 3 | GET | `/properties` | Get landlord's properties | Yes | Landlord |
| 4 | GET | `/properties/:id` | Get property details | Yes | Landlord |
| 5 | GET | `/properties/:id/analytics` | Get property analytics | Yes | Landlord |
| 6 | GET | `/properties/:id/tenants` | Get property tenants | Yes | Landlord |
| 7 | GET | `/properties/:id/bookings` | Get property bookings | Yes | Landlord |
| 8 | GET | `/applications` | Get all applications | Yes | Landlord |
| 9 | GET | `/applications/stats` | Get application stats | Yes | Landlord |
| 10 | GET | `/earnings` | Get earnings summary | Yes | Landlord |
| 11 | GET | `/earnings/breakdown` | Earnings by property | Yes | Landlord |
| 12 | GET | `/earnings/history` | Historical earnings | Yes | Landlord |
| 13 | GET | `/activity` | Get recent activity | Yes | Landlord |
| 14 | GET | `/notifications` | Get landlord notifications | Yes | Landlord |

---

## 🔨 14. Handyman APIs (`/api/v1/handyman`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/dashboard` | Get handyman dashboard | Yes | Handyman |
| 2 | GET | `/dashboard/stats` | Get quick stats | Yes | Handyman |
| 3 | GET | `/jobs` | Get assigned jobs | Yes | Handyman |
| 4 | GET | `/jobs/available` | Get available jobs to claim | Yes | Handyman |
| 5 | GET | `/jobs/:id` | Get job details | Yes | Handyman |
| 6 | PUT | `/jobs/:id/status` | Update job status | Yes | Handyman |
| 7 | GET | `/jobs/:id/checklist` | Get job checklist | Yes | Handyman |
| 8 | POST | `/jobs/:id/checklist` | Complete checklist items | Yes | Handyman |
| 9 | POST | `/jobs/:id/claim` | Claim available job | Yes | Handyman |
| 10 | POST | `/jobs/:id/photos` | Upload job photos | Yes | Handyman |
| 11 | POST | `/jobs/:id/notes` | Add job notes | Yes | Handyman |
| 12 | GET | `/schedule` | Get upcoming schedule | Yes | Handyman |
| 13 | GET | `/performance` | Get performance metrics | Yes | Handyman |
| 14 | PUT | `/profile/availability` | Update availability | Yes | Handyman |
| 15 | POST | `/onboarding` | Submit onboarding docs | Yes | Handyman |
| 16 | GET | `/earnings` | Get earnings summary | Yes | Handyman |

---

## 🏃 15. Homerunner APIs (`/api/v1/homerunner`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/dashboard` | Get homerunner dashboard | Yes | Homerunner |
| 2 | GET | `/dashboard/stats` | Get quick stats | Yes | Homerunner |
| 3 | GET | `/inspections` | Get assigned inspections | Yes | Homerunner |
| 4 | GET | `/inspections/:id` | Get inspection details | Yes | Homerunner |
| 5 | POST | `/inspections/:id/report` | Submit inspection report | Yes | Homerunner |
| 6 | POST | `/inspections/:id/photos` | Upload inspection photos | Yes | Homerunner |
| 7 | PUT | `/inspections/:id/status` | Update inspection status | Yes | Homerunner |
| 8 | GET | `/viewings` | Get scheduled viewings | Yes | Homerunner |
| 9 | GET | `/viewings/:id` | Get viewing details | Yes | Homerunner |
| 10 | PUT | `/viewings/:id/status` | Update viewing status | Yes | Homerunner |
| 11 | POST | `/viewings/:id/notes` | Add viewing notes | Yes | Homerunner |
| 12 | GET | `/earnings` | Get earnings summary | Yes | Homerunner |
| 13 | GET | `/schedule` | Get weekly schedule | Yes | Homerunner |
| 14 | POST | `/quick-actions/note` | Log quick note | Yes | Homerunner |
| 15 | POST | `/quick-actions/message` | Send tenant message | Yes | Homerunner |
| 16 | POST | `/quick-actions/reminder` | Set follow-up reminder | Yes | Homerunner |

---

## 🏗️ 16. Property Management APIs (`/api/v1/property-management`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/dashboard` | Get PM dashboard | Yes | PM |
| 2 | GET | `/dashboard/stats` | Get quick stats | Yes | PM |
| 3 | GET | `/properties` | Get managed properties | Yes | PM |
| 4 | GET | `/properties/:id` | Get property details | Yes | PM |
| 5 | GET | `/tenants` | List managed tenants | Yes | PM |
| 6 | GET | `/tenants/:id` | Get tenant details | Yes | PM |
| 7 | GET | `/maintenance` | Get maintenance requests | Yes | PM |
| 8 | POST | `/maintenance` | Create maintenance request | Yes | PM |
| 9 | PUT | `/maintenance/:id` | Update maintenance status | Yes | PM |
| 10 | GET | `/rent-collection` | Get rent collection status | Yes | PM |
| 11 | POST | `/rent-reminders` | Send rent reminders | Yes | PM |
| 12 | GET | `/security` | Get security monitoring data | Yes | PM |
| 13 | GET | `/security/cameras` | Get camera feeds list | Yes | PM |
| 14 | POST | `/security/alert` | Create security alert | Yes | PM |

---

## 🛡️ 17. Admin APIs (`/api/v1/admin`)

### Dashboard & Analytics
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/dashboard` | Get admin dashboard stats | Yes | Admin |
| 2 | GET | `/analytics` | Get platform analytics | Yes | Admin |
| 3 | GET | `/analytics/revenue` | Revenue analytics | Yes | Admin |
| 4 | GET | `/analytics/users` | User growth analytics | Yes | Admin |
| 5 | GET | `/analytics/properties` | Property analytics | Yes | Admin |
| 6 | GET | `/analytics/bookings` | Booking analytics | Yes | Admin |

### User Management
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 7 | GET | `/users` | List all users (paginated) | Yes | Admin |
| 8 | GET | `/users/:id` | Get user details | Yes | Admin |
| 9 | POST | `/users` | Create user | Yes | Admin |
| 10 | PUT | `/users/:id` | Update user | Yes | Admin |
| 11 | PATCH | `/users/:id/suspend` | Suspend user | Yes | Admin |
| 12 | PATCH | `/users/:id/reactivate` | Reactivate user | Yes | Admin |
| 13 | PATCH | `/users/:id/ban` | Ban user | Yes | Admin |
| 14 | DELETE | `/users/:id` | Delete user | Yes | Admin |
| 15 | POST | `/users/:id/message` | Send message to user | Yes | Admin |
| 16 | POST | `/users/:id/verify` | Manually verify user | Yes | Admin |

### Property Management
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 17 | GET | `/properties` | List all properties | Yes | Admin |
| 18 | GET | `/properties/:id` | Get property details | Yes | Admin |
| 19 | PATCH | `/properties/:id/approve` | Approve property | Yes | Admin |
| 20 | PATCH | `/properties/:id/reject` | Reject property | Yes | Admin |
| 21 | PATCH | `/properties/:id/suspend` | Suspend property | Yes | Admin |
| 22 | PATCH | `/properties/:id/reactivate` | Reactivate property | Yes | Admin |
| 23 | DELETE | `/properties/:id` | Delete property | Yes | Admin |

### Service Management
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 24 | GET | `/services` | List all services | Yes | Admin |
| 25 | GET | `/services/:id` | Get service details | Yes | Admin |
| 26 | PATCH | `/services/:id/approve` | Approve service | Yes | Admin |
| 27 | PATCH | `/services/:id/reject` | Reject service | Yes | Admin |
| 28 | PATCH | `/services/:id/suspend` | Suspend service | Yes | Admin |
| 29 | PATCH | `/services/:id/reactivate` | Reactivate service | Yes | Admin |
| 30 | DELETE | `/services/:id` | Delete service | Yes | Admin |

### Payment Management
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 31 | GET | `/payments` | List all payments | Yes | Admin |
| 32 | GET | `/payments/:id` | Get payment details | Yes | Admin |
| 33 | POST | `/payments/:id/refund` | Process refund | Yes | Admin |
| 34 | PATCH | `/payments/:id/approve` | Approve payment | Yes | Admin |
| 35 | PATCH | `/payments/:id/reject` | Reject payment | Yes | Admin |

### Background Check Management
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 36 | GET | `/background-checks` | List background checks | Yes | Admin |
| 37 | GET | `/background-checks/:id` | Get check details | Yes | Admin |
| 38 | GET | `/background-checks/:id/documents/:docId` | Get document | Yes | Admin |
| 39 | POST | `/background-checks/:id/approve` | Approve check | Yes | Admin |
| 40 | POST | `/background-checks/:id/reject` | Reject check | Yes | Admin |
| 41 | POST | `/background-checks/:id/documents/:docId/approve` | Approve document | Yes | Admin |
| 42 | POST | `/background-checks/:id/documents/:docId/reject` | Reject document | Yes | Admin |

### Dispute Management
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 43 | GET | `/disputes` | List disputes | Yes | Admin |
| 44 | GET | `/disputes/:id` | Get dispute details | Yes | Admin |
| 45 | POST | `/disputes/:id/message` | Message parties | Yes | Admin |
| 46 | PATCH | `/disputes/:id/resolve` | Resolve dispute | Yes | Admin |
| 47 | PATCH | `/disputes/:id/assign` | Assign to admin | Yes | Admin |

### Artisan Management
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 48 | GET | `/artisans` | List all artisans | Yes | Admin |
| 49 | GET | `/artisans/:id` | Get artisan details | Yes | Admin |
| 50 | PATCH | `/artisans/:id/approve` | Approve artisan | Yes | Admin |
| 51 | PATCH | `/artisans/:id/suspend` | Suspend artisan | Yes | Admin |

### Handyman Management
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 52 | GET | `/handymen` | List all handymen | Yes | Admin |
| 53 | GET | `/handymen/:id` | Get handyman details | Yes | Admin |
| 54 | PATCH | `/handymen/:id/approve` | Approve handyman | Yes | Admin |
| 55 | PATCH | `/handymen/:id/suspend` | Suspend handyman | Yes | Admin |
| 56 | GET | `/handymen/:id/performance` | Get performance metrics | Yes | Admin |

### Homerunner Management
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 57 | GET | `/homerunners` | List all homerunners | Yes | Admin |
| 58 | GET | `/homerunners/:id` | Get homerunner details | Yes | Admin |
| 59 | PATCH | `/homerunners/:id/approve` | Approve homerunner | Yes | Admin |
| 60 | PATCH | `/homerunners/:id/suspend` | Suspend homerunner | Yes | Admin |
| 61 | GET | `/homerunners/:id/performance` | Get performance metrics | Yes | Admin |

### Approvals Queue
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 62 | GET | `/approvals` | Get pending approvals | Yes | Admin |
| 63 | GET | `/approvals/properties` | Pending property approvals | Yes | Admin |
| 64 | GET | `/approvals/services` | Pending service approvals | Yes | Admin |
| 65 | GET | `/approvals/users` | Pending user verifications | Yes | Admin |

### Reports & Exports
| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 66 | GET | `/reports/revenue` | Revenue report | Yes | Admin |
| 67 | GET | `/reports/users` | User report | Yes | Admin |
| 68 | GET | `/reports/properties` | Property report | Yes | Admin |
| 69 | POST | `/reports/export` | Export data | Yes | Admin |

---

## 📅 18. Events/Calendar APIs (`/api/v1/events`)

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/` | Get user's events | Yes | All |
| 2 | GET | `/:id` | Get event details | Yes | All |
| 3 | GET | `/calendar` | Get calendar view data | Yes | All |
| 4 | GET | `/upcoming` | Get upcoming events | Yes | All |
| 5 | PUT | `/:id/cancel` | Cancel event | Yes | All |
| 6 | POST | `/:id/reschedule` | Reschedule event | Yes | All |
| 7 | POST | `/reminders` | Set event reminder | Yes | All |
| 8 | GET | `/types` | Get event types | Yes | All |

---

## 🔧 19. Utility APIs

### Locations (`/api/v1/locations`)
| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 1 | GET | `/` | Get supported locations | No |
| 2 | GET | `/:id/areas` | Get areas in location | No |
| 3 | GET | `/search` | Search locations | No |

### Content (`/api/v1/content`)
| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 4 | GET | `/about` | About page content | No |
| 5 | GET | `/terms` | Terms of service | No |
| 6 | GET | `/privacy` | Privacy policy | No |
| 7 | GET | `/faq` | FAQ content | No |
| 8 | POST | `/contact` | Submit contact form | No |

### System (`/api/v1/system`)
| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 9 | GET | `/health` | Health check | No |
| 10 | GET | `/version` | API version info | No |

---

## 📊 Total API Count by Role

| Role | Accessible Endpoints |
|------|---------------------|
| **Public (No Auth)** | ~55 |
| **Tenant** | ~130 |
| **Landlord** | ~110 |
| **Service Provider** | ~65 |
| **Artisan** | ~75 |
| **Property Manager** | ~70 |
| **Handyman** | ~60 |
| **Homerunner** | ~60 |
| **Admin** | ~200 |
| **Super Admin** | ~289 (All) |

---

## 📝 Notes

1. **Authentication**: All authenticated endpoints require `Authorization: Bearer {accessToken}` header
2. **Active Role**: Multi-role users must include `X-Active-Role` header with valid role
3. **Pagination**: List endpoints support `?page=1&limit=20` query params
4. **Filtering**: Most list endpoints support relevant filters via query params
5. **Sorting**: Use `?sortBy=field&sortDirection=asc|desc` for sorting
6. **File Upload**: Endpoints accepting files use `multipart/form-data`
7. **Rate Limiting**: 100 requests per 15 minutes per IP
8. **Versioning**: All endpoints are prefixed with `/api/v1/`

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Total Endpoints:** ~289  
**For detailed backend development guide, see [BACKEND_API_SPEC.md](BACKEND_API_SPEC.md)**
