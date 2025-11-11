# 🔧 JulaazNG Backend API Specification
## Comprehensive Backend Development Guide

---

## 1. Technology Stack

### 1.1 Core Technologies
- **Runtime**: Node.js 20+ (LTS)
- **Framework**: Express.js / NestJS (recommended for scalability)
- **Language**: TypeScript
- **Database**: PostgreSQL 15+ (primary), Redis (caching & sessions)
- **ORM**: Prisma / TypeORM
- **Authentication**: JWT + Refresh Tokens
- **File Storage**: AWS S3 / Cloudinary (images, videos, documents)
- **Real-time**: Socket.io (messaging, notifications)
- **Payment**: Paystack / Flutterwave
- **Email**: SendGrid / AWS SES
- **SMS**: Twilio / Termii

### 1.2 Architecture Pattern
- **RESTful API** with versioning (`/api/v1/`)
- **Microservices-ready** modular structure
- **Clean Architecture** (Controllers → Services → Repositories)
- **Event-Driven** for notifications and background jobs

---

## 2. Database Schema

### 2.1 Core Entities

#### **Users**
```typescript
{
  id: UUID (PK)
  firstName: string
  lastName: string
  email: string (unique, indexed)
  phoneNumber: string (unique, indexed)
  phoneCountryCode: string (default: '+234')
  nationality: string (default: 'Nigeria')
  password: string (hashed)
  dateOfBirth: Date
  gender: enum ['male', 'female', 'other']
  roles: enum[] ['tenant', 'landlord', 'admin', 'service_provider', 'artisan', 'property_manager', 'handyman', 'homerunner']
  preferredRole: enum ['tenant', 'landlord', 'admin', 'service_provider', 'artisan', 'property_manager', 'handyman', 'homerunner']
  profilePicture: string (URL)
  isEmailVerified: boolean (default: false)
  isPhoneVerified: boolean (default: false)
  isBackgroundChecked: boolean (default: false)
  backgroundCheckStatus: enum ['pending', 'submitted', 'verified', 'rejected']
  backgroundCheckData: JSON (financial, occupation, documents)
  createdAt: DateTime
  updatedAt: DateTime
  lastLoginAt: DateTime
}
```

> **Active Role Context:** Every authenticated request must include `X-Active-Role` header with one of the user's assigned roles. The backend validates that the header value exists in `roles` before authorizing the request, ensuring multi-role users can switch contexts without re-authentication.

#### **Properties**
```typescript
{
  id: UUID (PK)
  landlordId: UUID (FK → Users)
  title: string
  description: text
  address: string
  city: string
  state: string
  country: string (default: 'Nigeria')
  latitude: decimal
  longitude: decimal
  propertyType: enum ['apartment', 'house', 'duplex', 'studio', 'penthouse']
  bedrooms: integer
  bathrooms: integer
  toilets: integer
  carParkingSpaces: integer
  squareMeters: decimal
  rentalCategories: enum[] ['long_term', 'shortlet']
  
  // Long-term rental
  annualRent: decimal
  monthlyRent: decimal (calculated)
  minimumTenancyMonths: integer
  
  // Shortlet
  nightlyRate: decimal
  weeklyRate: decimal
  minimumStayNights: integer
  maximumStayNights: integer
  
  // Amenities
  amenities: JSON {
    power: boolean
    water: boolean
    internet: boolean
    security: boolean
    generator: boolean
    airConditioning: boolean
    heating: boolean
    parking: boolean
    elevator: boolean
    gym: boolean
    pool: boolean
    garden: boolean
  }
  
  // Media
  images: string[] (URLs, max 4)
  video: string (URL, optional)
  virtualTourUrl: string (optional)
  
  // Status
  status: enum ['inactive', 'pending_inspection', 'active', 'reserved', 'rented']
  isShortletReady: boolean
  inspectionDate: DateTime
  inspectionNotes: text
  
  // Metadata
  viewCount: integer (default: 0)
  favouriteCount: integer (default: 0)
  averageRating: decimal (default: 0)
  totalReviews: integer (default: 0)
  
  createdAt: DateTime
  updatedAt: DateTime
  publishedAt: DateTime
}
```

#### **PropertyBookings (Viewing Requests & Applications)**
```typescript
{
  id: UUID (PK)
  propertyId: UUID (FK → Properties)
  tenantId: UUID (FK → Users)
  landlordId: UUID (FK → Users)
  
  // Viewing Details
  preferredViewingDates: JSON[] {
    date: Date
    timeSlot: string
    status: enum ['pending', 'confirmed', 'cancelled']
  }
  
  // Application Details
  rentalPreference: enum ['annual_lease', 'shortlet']
  moveInDate: Date (for long-term) | checkInDate: Date (for shortlet)
  checkOutDate: Date (for shortlet only)
  tenancyDurationMonths: integer (for long-term)
  shortletStayLengthNights: integer (for shortlet)
  minimumBudget: decimal
  additionalNotes: text
  
  // Status Tracking
  status: enum ['pending', 'viewing_scheduled', 'viewing_completed', 'application_submitted', 'approved', 'rejected', 'agreement_sent', 'agreement_signed', 'payment_pending', 'payment_completed', 'active', 'completed', 'cancelled']
  
  // Timeline
  timeline: JSON[] {
    event: string
    timestamp: DateTime
    actor: UUID (FK → Users)
    notes: text
  }
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### **Agreements**
```typescript
{
  id: UUID (PK)
  bookingId: UUID (FK → PropertyBookings)
  propertyId: UUID (FK → Properties)
  tenantId: UUID (FK → Users)
  landlordId: UUID (FK → Users)
  
  agreementType: enum ['annual_lease', 'shortlet']
  title: string
  content: text (agreement terms)
  pdfUrl: string (generated PDF)
  
  startDate: Date
  endDate: Date
  rentAmount: decimal
  securityDeposit: decimal
  
  // E-signature
  tenantSignature: string (URL or base64)
  tenantSignedAt: DateTime
  landlordSignature: string (URL or base64)
  landlordSignedAt: DateTime
  
  status: enum ['draft', 'sent', 'signed', 'active', 'expired', 'terminated']
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### **Payments**
```typescript
{
  id: UUID (PK)
  userId: UUID (FK → Users)
  bookingId: UUID (FK → PropertyBookings, optional)
  agreementId: UUID (FK → Agreements, optional)
  
  paymentType: enum ['rent', 'security_deposit', 'processing_fee', 'legal_fee', 'insurance', 'service_booking', 'commission']
  
  // Payment Items
  items: JSON[] {
    description: string
    amount: decimal
  }
  
  subtotal: decimal
  processingFee: decimal (1.5% of subtotal)
  totalAmount: decimal
  
  // Payment Details
  paymentMethod: enum ['card', 'bank_transfer', 'wallet']
  paymentReference: string (Paystack/Flutterwave reference)
  paymentGateway: enum ['paystack', 'flutterwave']
  
  status: enum ['pending', 'processing', 'completed', 'failed', 'refunded']
  
  dueDate: Date
  paidAt: DateTime
  
  // Metadata
  metadata: JSON {
    cardLast4: string
    bankName: string
    accountNumber: string
  }
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### **Messages**
```typescript
{
  id: UUID (PK)
  conversationId: UUID (FK → Conversations)
  senderId: UUID (FK → Users)
  
  content: text
  messageType: enum ['text', 'image', 'document', 'system']
  attachments: string[] (URLs)
  
  isRead: boolean (default: false)
  readAt: DateTime
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### **Conversations**
```typescript
{
  id: UUID (PK)
  participants: UUID[] (FK → Users)
  conversationType: enum ['viewing_request', 'general', 'support']
  
  relatedPropertyId: UUID (FK → Properties, optional)
  relatedBookingId: UUID (FK → PropertyBookings, optional)
  
  lastMessageAt: DateTime
  lastMessagePreview: string
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### **Notifications**
```typescript
{
  id: UUID (PK)
  userId: UUID (FK → Users)
  
  type: enum ['viewing_request', 'viewing_approved', 'viewing_rejected', 'application_update', 'payment_due', 'payment_received', 'message_received', 'document_approved', 'document_rejected', 'agreement_sent', 'system']
  
  title: string
  message: text
  icon: string
  
  relatedEntityType: enum ['property', 'booking', 'payment', 'agreement', 'message']
  relatedEntityId: UUID
  
  isRead: boolean (default: false)
  readAt: DateTime
  
  createdAt: DateTime
}
```

#### **Favourites**
```typescript
{
  id: UUID (PK)
  userId: UUID (FK → Users)
  
  itemType: enum ['property', 'service', 'provider']
  itemId: UUID
  
  createdAt: DateTime
}
```

#### **Services**
```typescript
{
  id: UUID (PK)
  providerId: UUID (FK → Users)
  
  name: string
  description: text
  category: enum ['cleaning', 'moving', 'plumbing', 'electrical', 'carpentry', 'painting', 'tiling', 'mechanic']
  
  pricing: JSON {
    basePrice: decimal
    priceType: enum ['fixed', 'hourly', 'per_sqm']
    diagnosticFee: decimal (for artisans)
  }
  
  images: string[] (URLs)
  
  availability: JSON {
    days: string[]
    hours: { start: string, end: string }
  }
  
  isActive: boolean (default: true)
  averageRating: decimal (default: 0)
  totalBookings: integer (default: 0)
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### **ServiceBookings**
```typescript
{
  id: UUID (PK)
  serviceId: UUID (FK → Services)
  userId: UUID (FK → Users)
  providerId: UUID (FK → Users)
  
  bookingDate: Date
  bookingTime: string
  address: string
  
  status: enum ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
  
  // Pricing
  quotedPrice: decimal
  finalPrice: decimal
  diagnosticFeePaid: boolean (for artisans)
  
  // Review
  rating: integer (1-5)
  review: text
  reviewedAt: DateTime
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### **LandlordEarnings**
```typescript
{
  id: UUID (PK)
  landlordId: UUID (FK → Users)
  propertyId: UUID (FK → Properties)
  bookingId: UUID (FK → PropertyBookings)
  
  earningType: enum ['monthly_rent', 'shortlet', 'security_deposit_return']
  amount: decimal
  commission: decimal (platform commission)
  netAmount: decimal
  
  dueDate: Date
  status: enum ['upcoming', 'received', 'overdue']
  paidAt: DateTime
  
  tenantName: string
  propertyName: string
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### **LandlordApplications**
```typescript
{
  id: UUID (PK)
  landlordId: UUID (FK → Users)
  propertyId: UUID (FK → Properties)
  bookingId: UUID (FK → PropertyBookings)
  tenantId: UUID (FK → Users)
  
  tenantName: string
  tenantEmail: string
  tenantPhone: string
  tenantProfilePicture: string
  
  preferredViewingDates: JSON[]
  moveInDate: Date
  budget: decimal
  
  status: enum ['pending', 'approved', 'rejected']
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## 3. API Endpoints

### 3.1 Authentication (`/api/v1/auth`)

#### POST `/register`
**Request:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "phoneCountryCode": "+234",
  "password": "string",
  "confirmPassword": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "gender": "male|female|other",
  "role": "tenant|landlord"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "userId": "uuid",
    "email": "string"
  }
}
```

#### POST `/verify-otp`
**Request:**
```json
{
  "email": "string",
  "otp": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "accessToken": "jwt",
    "refreshToken": "jwt",
    "user": { /* user object */ }
  }
}
```

#### POST `/login`
**Request:**
```json
{
  "emailOrPhone": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt",
    "refreshToken": "jwt",
    "user": {
      "id": "uuid",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "tenant|landlord|admin",
      "profilePicture": "url",
      "isEmailVerified": true,
      "isBackgroundChecked": false
    }
  }
}
```

#### POST `/refresh-token`
**Request:**
```json
{
  "refreshToken": "jwt"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt"
  }
}
```

#### POST `/logout`
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 3.2 Properties (`/api/v1/properties`)

#### GET `/`
**Query Params:**
```
?city=Lagos&propertyType=apartment&bedrooms=2&minPrice=500000&maxPrice=2000000&rentalCategory=long_term&page=1&limit=20
```
**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": "uuid",
        "title": "string",
        "address": "string",
        "city": "string",
        "propertyType": "apartment",
        "bedrooms": 2,
        "bathrooms": 2,
        "carParkingSpaces": 1,
        "rentalCategories": ["long_term", "shortlet"],
        "annualRent": 1200000,
        "monthlyRent": 100000,
        "nightlyRate": 15000,
        "images": ["url1", "url2"],
        "averageRating": 4.5,
        "totalReviews": 12,
        "isFavourite": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### GET `/:id`
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "text",
    "address": "string",
    "city": "string",
    "propertyType": "apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "toilets": 2,
    "carParkingSpaces": 1,
    "squareMeters": 120,
    "rentalCategories": ["long_term", "shortlet"],
    "annualRent": 1200000,
    "monthlyRent": 100000,
    "nightlyRate": 15000,
    "weeklyRate": 90000,
    "minimumStayNights": 2,
    "amenities": { /* amenities object */ },
    "images": ["url1", "url2", "url3", "url4"],
    "video": "url",
    "owner": {
      "id": "uuid",
      "name": "string",
      "profilePicture": "url",
      "averageRating": 4.8,
      "totalProperties": 5,
      "joinedDate": "2024-01-15"
    },
    "moveInBreakdown": {
      "rent": 1200000,
      "securityDeposit": 1200000,
      "legalFee": 50000,
      "agencyFee": 120000,
      "total": 2570000
    },
    "shortletOffering": {
      "nightlyRate": 15000,
      "weeklyRate": 90000,
      "minimumStay": 2,
      "maximumStay": 30
    },
    "longTermOffering": {
      "annualRent": 1200000,
      "monthlyRent": 100000,
      "minimumTenancy": 12
    },
    "isFavourite": false,
    "viewCount": 245,
    "averageRating": 4.5,
    "totalReviews": 12
  }
}
```

#### POST `/` (Landlord only)
**Headers:** `Authorization: Bearer {accessToken}`
**Request:** (multipart/form-data)
```json
{
  "title": "string",
  "description": "text",
  "address": "string",
  "city": "string",
  "state": "string",
  "propertyType": "apartment",
  "bedrooms": 2,
  "bathrooms": 2,
  "toilets": 2,
  "carParkingSpaces": 1,
  "squareMeters": 120,
  "rentalCategories": ["long_term", "shortlet"],
  "annualRent": 1200000,
  "nightlyRate": 15000,
  "minimumTenancyMonths": 12,
  "minimumStayNights": 2,
  "amenities": { /* amenities object */ },
  "images": [File, File, File, File],
  "video": File
}
```
**Response:**
```json
{
  "success": true,
  "message": "Property submitted for inspection",
  "data": {
    "propertyId": "uuid",
    "status": "pending_inspection"
  }
}
```

#### PUT `/:id` (Landlord only)
**Headers:** `Authorization: Bearer {accessToken}`
**Request:** (same as POST)
**Response:**
```json
{
  "success": true,
  "message": "Property updated successfully",
  "data": { /* updated property */ }
}
```

#### DELETE `/:id` (Landlord only)
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

### 3.3 Property Bookings (`/api/v1/bookings`)

#### POST `/viewing-request`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:**
```json
{
  "propertyId": "uuid",
  "preferredViewingDates": [
    { "date": "2025-11-15", "timeSlot": "10:00 AM - 11:00 AM" },
    { "date": "2025-11-16", "timeSlot": "2:00 PM - 3:00 PM" }
  ],
  "rentalPreference": "annual_lease|shortlet",
  "moveInDate": "2025-12-01",
  "checkInDate": "2025-12-01",
  "checkOutDate": "2025-12-10",
  "tenancyDurationMonths": 12,
  "shortletStayLengthNights": 10,
  "minimumBudget": 1000000,
  "additionalNotes": "text"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Viewing request submitted successfully",
  "data": {
    "bookingId": "uuid",
    "conversationId": "uuid",
    "status": "pending"
  }
}
```

#### GET `/my-bookings` (Tenant)
**Headers:** `Authorization: Bearer {accessToken}`
**Query Params:** `?status=pending&page=1&limit=10`
**Response:**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "property": {
          "id": "uuid",
          "title": "string",
          "address": "string",
          "images": ["url"]
        },
        "status": "viewing_scheduled",
        "rentalPreference": "annual_lease",
        "moveInDate": "2025-12-01",
        "budget": 1000000,
        "timeline": [
          {
            "event": "Viewing request submitted",
            "timestamp": "2025-11-10T10:00:00Z"
          }
        ],
        "createdAt": "2025-11-10T10:00:00Z"
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

#### GET `/applications` (Landlord)
**Headers:** `Authorization: Bearer {accessToken}`
**Query Params:** `?status=pending&propertyId=uuid&page=1&limit=10`
**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "property": {
          "id": "uuid",
          "title": "string",
          "address": "string"
        },
        "tenant": {
          "id": "uuid",
          "name": "string",
          "email": "string",
          "phone": "string",
          "profilePicture": "url",
          "isBackgroundChecked": true
        },
        "preferredViewingDates": [ /* dates */ ],
        "moveInDate": "2025-12-01",
        "budget": 1000000,
        "status": "pending",
        "createdAt": "2025-11-10T10:00:00Z"
      }
    ],
    "stats": {
      "total": 45,
      "pending": 12,
      "approved": 25,
      "rejected": 8
    },
    "pagination": { /* pagination object */ }
  }
}
```

#### PATCH `/applications/:id/approve` (Landlord)
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "message": "Application approved successfully",
  "data": {
    "applicationId": "uuid",
    "status": "approved"
  }
}
```

#### PATCH `/applications/:id/reject` (Landlord)
**Headers:** `Authorization: Bearer {accessToken}`
**Request:**
```json
{
  "reason": "text"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Application rejected",
  "data": {
    "applicationId": "uuid",
    "status": "rejected"
  }
}
```

---

### 3.4 Agreements (`/api/v1/agreements`)

#### GET `/` (Tenant)
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "data": {
    "agreements": [
      {
        "id": "uuid",
        "property": {
          "id": "uuid",
          "title": "string",
          "address": "string"
        },
        "agreementType": "annual_lease",
        "title": "string",
        "startDate": "2025-12-01",
        "endDate": "2026-12-01",
        "rentAmount": 1200000,
        "status": "active",
        "tenantSignedAt": "2025-11-20T10:00:00Z",
        "createdAt": "2025-11-15T10:00:00Z"
      }
    ]
  }
}
```

#### GET `/:id`
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "property": { /* property details */ },
    "agreementType": "annual_lease",
    "title": "string",
    "content": "text",
    "pdfUrl": "url",
    "startDate": "2025-12-01",
    "endDate": "2026-12-01",
    "rentAmount": 1200000,
    "securityDeposit": 1200000,
    "tenantSignature": "url",
    "tenantSignedAt": "2025-11-20T10:00:00Z",
    "status": "active"
  }
}
```

#### POST `/:id/sign` (Tenant)
**Headers:** `Authorization: Bearer {accessToken}`
**Request:** (multipart/form-data)
```json
{
  "signature": File (image or base64)
}
```
**Response:**
```json
{
  "success": true,
  "message": "Agreement signed successfully",
  "data": {
    "agreementId": "uuid",
    "status": "signed"
  }
}
```

---

### 3.5 Payments (`/api/v1/payments`)

#### GET `/` (Tenant)
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalDue": 2570000,
      "totalPaid": 1200000,
      "pendingPayments": 1
    },
    "payments": [
      {
        "id": "uuid",
        "paymentType": "rent",
        "items": [
          { "description": "Annual Rent", "amount": 1200000 }
        ],
        "totalAmount": 1218000,
        "processingFee": 18000,
        "status": "pending",
        "dueDate": "2025-12-01",
        "createdAt": "2025-11-15T10:00:00Z"
      }
    ]
  }
}
```

#### POST `/initiate`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:**
```json
{
  "paymentId": "uuid",
  "paymentMethod": "card|bank_transfer"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "paymentReference": "string",
    "authorizationUrl": "url",
    "accessCode": "string"
  }
}
```

#### POST `/verify`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:**
```json
{
  "paymentReference": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "paymentId": "uuid",
    "status": "completed",
    "paidAt": "2025-11-15T10:30:00Z"
  }
}
```

---

### 3.6 Messaging (`/api/v1/messages`)

#### GET `/conversations`
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "participants": [
          {
            "id": "uuid",
            "name": "string",
            "profilePicture": "url",
            "isOnline": true
          }
        ],
        "conversationType": "viewing_request",
        "relatedProperty": {
          "id": "uuid",
          "title": "string"
        },
        "lastMessage": {
          "content": "string",
          "senderId": "uuid",
          "createdAt": "2025-11-15T10:00:00Z"
        },
        "unreadCount": 2,
        "lastMessageAt": "2025-11-15T10:00:00Z"
      }
    ]
  }
}
```

#### GET `/conversations/:id/messages`
**Headers:** `Authorization: Bearer {accessToken}`
**Query Params:** `?page=1&limit=50`
**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "senderId": "uuid",
        "content": "text",
        "messageType": "text",
        "attachments": [],
        "isRead": true,
        "createdAt": "2025-11-15T10:00:00Z"
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

#### POST `/conversations/:id/messages`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:** (multipart/form-data)
```json
{
  "content": "text",
  "attachments": [File, File]
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "uuid",
    "content": "text",
    "createdAt": "2025-11-15T10:00:00Z"
  }
}
```

#### PATCH `/messages/:id/read`
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "message": "Message marked as read"
}
```

---

### 3.7 Notifications (`/api/v1/notifications`)

#### GET `/`
**Headers:** `Authorization: Bearer {accessToken}`
**Query Params:** `?isRead=false&page=1&limit=20`
**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "viewing_approved",
        "title": "Viewing Approved",
        "message": "Your viewing request for Modern 2BR Apartment has been approved",
        "icon": "CheckCircle",
        "relatedEntityType": "booking",
        "relatedEntityId": "uuid",
        "isRead": false,
        "createdAt": "2025-11-15T10:00:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": { /* pagination object */ }
  }
}
```

#### PATCH `/:id/read`
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

#### PATCH `/mark-all-read`
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### 3.8 Favourites (`/api/v1/favourites`)

#### GET `/`
**Headers:** `Authorization: Bearer {accessToken}`
**Query Params:** `?itemType=property&page=1&limit=20`
**Response:**
```json
{
  "success": true,
  "data": {
    "favourites": [
      {
        "id": "uuid",
        "itemType": "property",
        "item": {
          "id": "uuid",
          "title": "string",
          "address": "string",
          "images": ["url"],
          "annualRent": 1200000
        },
        "createdAt": "2025-11-15T10:00:00Z"
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

#### POST `/`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:**
```json
{
  "itemType": "property|service|provider",
  "itemId": "uuid"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Added to favourites",
  "data": {
    "favouriteId": "uuid"
  }
}
```

#### DELETE `/:id`
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "message": "Removed from favourites"
}
```

---

### 3.9 Landlord Earnings (`/api/v1/landlord/earnings`)

#### GET `/`
**Headers:** `Authorization: Bearer {accessToken}`
**Query Params:** `?status=upcoming&year=2025&month=11&page=1&limit=20`
**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalMonth": 5000000,
      "upcoming": 2000000,
      "overdue": 500000,
      "shortletShare": 1500000
    },
    "earnings": [
      {
        "id": "uuid",
        "property": {
          "id": "uuid",
          "title": "string",
          "address": "string"
        },
        "tenant": {
          "name": "string"
        },
        "earningType": "monthly_rent",
        "amount": 100000,
        "commission": 5000,
        "netAmount": 95000,
        "dueDate": "2025-12-01",
        "status": "upcoming",
        "createdAt": "2025-11-15T10:00:00Z"
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

---

### 3.10 Profile & Settings (`/api/v1/users`)

#### GET `/profile`
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phoneNumber": "string",
    "dateOfBirth": "1995-05-15",
    "gender": "male",
    "nationality": "Nigeria",
    "profilePicture": "url",
    "isEmailVerified": true,
    "isPhoneVerified": true,
    "isBackgroundChecked": true,
    "backgroundCheckStatus": "verified",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

#### PUT `/profile`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:** (multipart/form-data)
```json
{
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string",
  "dateOfBirth": "1995-05-15",
  "gender": "male",
  "profilePicture": File
}
```
**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user */ }
}
```

#### POST `/background-check`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:** (multipart/form-data)
```json
{
  "employment": {
    "status": "employed|self_employed|student|unemployed",
    "employer": "string",
    "position": "string",
    "monthlyIncome": 500000
  },
  "financial": {
    "bankName": "string",
    "accountNumber": "string",
    "hasGuarantor": true
  },
  "documents": {
    "idCard": File,
    "proofOfIncome": File,
    "guarantorLetter": File
  }
}
```
**Response:**
```json
{
  "success": true,
  "message": "Background check submitted for verification",
  "data": {
    "backgroundCheckStatus": "submitted"
  }
}
```

---

## 4. Real-time Events (Socket.io)

### 4.1 Connection
```javascript
socket.on('connect', () => {
  socket.emit('authenticate', { token: 'jwt' })
})
```

### 4.2 Events

#### **Message Events**
- `message:new` - New message received
- `message:read` - Message marked as read
- `conversation:typing` - User is typing

#### **Notification Events**
- `notification:new` - New notification

#### **Booking Events**
- `booking:status_changed` - Booking status updated
- `application:approved` - Application approved
- `application:rejected` - Application rejected

---

## 5. Error Handling

### 5.1 Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 5.2 HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### 5.3 Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Authentication failed
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `DUPLICATE_ENTRY` - Resource already exists
- `PAYMENT_ERROR` - Payment processing failed
- `FILE_UPLOAD_ERROR` - File upload failed
- `RATE_LIMIT_EXCEEDED` - Too many requests

---

## 6. Security & Best Practices

### 6.1 Authentication
- JWT with 15-minute access tokens
- Refresh tokens with 7-day expiry
- HTTP-only cookies for refresh tokens
- Password hashing with bcrypt (10 rounds)

### 6.2 Authorization
- Role-based access control (RBAC)
- Resource ownership validation
- API key for admin operations

### 6.3 Data Protection
- Input validation with Joi/Zod
- SQL injection prevention (ORM parameterized queries)
- XSS protection (sanitize inputs)
- CORS configuration
- Rate limiting (100 requests/15 minutes per IP)
- File upload validation (size, type, virus scan)

### 6.4 Logging & Monitoring
- Winston for structured logging
- Request/response logging
- Error tracking (Sentry)
- Performance monitoring (New Relic / DataDog)

---

## 7. Deployment & Infrastructure

### 7.1 Hosting
- **API**: AWS EC2 / DigitalOcean / Heroku
- **Database**: AWS RDS PostgreSQL
- **Redis**: AWS ElastiCache / Redis Cloud
- **File Storage**: AWS S3 / Cloudinary
- **CDN**: CloudFront / Cloudflare

### 7.2 CI/CD
- GitHub Actions / GitLab CI
- Automated testing (Jest, Supertest)
- Code quality checks (ESLint, Prettier)
- Docker containerization

### 7.3 Environment Variables
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
PAYSTACK_SECRET_KEY=...
SENDGRID_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
```

---

## 8. Testing Strategy

### 8.1 Unit Tests
- Service layer logic
- Utility functions
- Validation schemas

### 8.2 Integration Tests
- API endpoints
- Database operations
- Third-party integrations

### 8.3 E2E Tests
- Critical user flows
- Payment processing
- Authentication flows

---

## 9. Performance Optimization

### 9.1 Caching
- Redis for session storage
- Cache frequently accessed data (properties, user profiles)
- Cache invalidation strategies

### 9.2 Database Optimization
- Proper indexing (email, phoneNumber, propertyId, userId)
- Query optimization
- Connection pooling
- Read replicas for scaling

### 9.3 API Optimization
- Pagination for list endpoints
- Response compression (gzip)
- Lazy loading for related entities
- CDN for static assets

---

## 10. Next Steps

### 10.1 Phase 1 (Weeks 1-2)
- [ ] Project setup (NestJS, Prisma, PostgreSQL)
- [ ] Database schema implementation
- [ ] Authentication endpoints
- [ ] User profile endpoints

### 10.2 Phase 2 (Weeks 3-4)
- [ ] Property CRUD endpoints
- [ ] Property search & filtering
- [ ] File upload (images, videos)
- [ ] Favourites endpoints

### 10.3 Phase 3 (Weeks 5-6)
- [ ] Booking & viewing request endpoints
- [ ] Messaging system (Socket.io)
- [ ] Notifications system
- [ ] Admin approval workflows

### 10.4 Phase 4 (Weeks 7-8)
- [ ] Agreements & e-signature
- [ ] Payment integration (Paystack)
- [ ] Landlord earnings & applications
- [ ] Background check workflow

### 10.5 Phase 5 (Weeks 9-10)
- [ ] Services & service bookings
- [ ] Reviews & ratings
- [ ] Admin dashboard
- [ ] Testing & deployment

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Prepared By:** JulaazNG Development Team

