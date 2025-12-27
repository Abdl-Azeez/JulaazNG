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

#### **Disputes**
```typescript
{
  id: UUID (PK)
  reference: string (unique, indexed) // e.g., "DISP-2025-001"
  type: enum ['payment', 'property', 'service', 'booking', 'other']
  
  complainantId: UUID (FK → Users)
  respondentId: UUID (FK → Users)
  
  relatedPropertyId: UUID (FK → Properties, optional)
  relatedBookingId: UUID (FK → PropertyBookings, optional)
  relatedPaymentId: UUID (FK → Payments, optional)
  relatedServiceBookingId: UUID (FK → ServiceBookings, optional)
  
  title: string
  description: text
  documents: JSON[] {
    id: UUID
    name: string
    type: enum ['image', 'pdf', 'document']
    url: string
    uploadedAt: DateTime
  }
  
  status: enum ['open', 'in_progress', 'resolved', 'closed']
  resolution: enum ['in_favor_of_complainant', 'in_favor_of_respondent', 'closed_without_resolution', null]
  resolutionNotes: text
  
  conversationId: UUID (FK → Conversations, optional) // Links to associated chat
  
  createdAt: DateTime
  updatedAt: DateTime
  resolvedAt: DateTime
}
```

#### **BackgroundChecks**
```typescript
{
  id: UUID (PK)
  userId: UUID (FK → Users, unique)
  
  status: enum ['pending', 'submitted', 'in_review', 'verified', 'rejected']
  progress: integer (0-100)
  
  personalInfo: JSON {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    dateOfBirth: Date
    nationality: string
  }
  
  employment: JSON {
    status: enum ['employed', 'self_employed', 'student', 'unemployed']
    employer: string
    position: string
    monthlyIncome: decimal
    employmentLength: integer // months
  }
  
  financial: JSON {
    bankName: string
    accountNumber: string
    hasGuarantor: boolean
    guarantorDetails: JSON (optional)
  }
  
  documents: JSON[] {
    id: UUID
    type: enum ['id_card', 'proof_of_income', 'employment_letter', 'bank_statement', 'guarantor_letter']
    name: string
    url: string
    status: enum ['pending', 'approved', 'rejected']
    uploadedAt: DateTime
    reviewedAt: DateTime
    reviewedBy: UUID (FK → Users, optional)
    rejectionReason: text (optional)
  }
  
  submittedAt: DateTime
  verifiedAt: DateTime
  verifiedBy: UUID (FK → Users, optional)
  rejectionReason: text (optional)
  
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

## 11. Admin API Endpoints

### 11.1 Analytics (`/api/v1/admin/analytics`)

#### GET `/dashboard`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": 50000000,
      "thisMonth": 5000000,
      "lastMonth": 4500000,
      "growth": 11.11,
      "monthlyBreakdown": [
        { "month": "January", "revenue": 3000000, "users": 1200 },
        { "month": "February", "revenue": 3500000, "users": 1400 }
      ]
    },
    "users": {
      "total": 15000,
      "thisMonth": 1200,
      "lastMonth": 1000,
      "growth": 20,
      "monthlyBreakdown": [
        { "month": "January", "revenue": 3000000, "users": 1200 },
        { "month": "February", "revenue": 3500000, "users": 1400 }
      ]
    },
    "properties": {
      "total": 500,
      "active": 450,
      "pending": 30,
      "suspended": 20
    },
    "bookings": {
      "total": 1200,
      "active": 800,
      "pending": 200,
      "completed": 200
    }
  }
}
```

### 11.2 User Management (`/api/v1/admin/users`)

#### GET `/`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Query Params:** `?page=1&limit=20&sortBy=name&sortDirection=asc&role=tenant&status=active&search=john`
**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "phoneNumber": "string",
        "roles": ["tenant", "landlord"],
        "profilePicture": "url",
        "isEmailVerified": true,
        "isPhoneVerified": true,
        "isBackgroundChecked": true,
        "backgroundCheckStatus": "verified",
        "status": "active",
        "createdAt": "2024-01-15T10:00:00Z",
        "lastLoginAt": "2025-12-01T10:00:00Z"
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
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
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
    "roles": ["tenant"],
    "profilePicture": "url",
    "isEmailVerified": true,
    "isBackgroundChecked": true,
    "backgroundCheckStatus": "verified",
    "status": "active",
    "properties": [
      {
        "id": "uuid",
        "title": "string",
        "address": "string",
        "status": "active"
      }
    ],
    "tenantStats": {
      "propertiesViewed": 15,
      "viewingRequests": 8,
      "currentRentals": 1,
      "shortletsUsed": 3
    },
    "backgroundCheck": {
      "status": "verified",
      "documents": [
        {
          "id": "uuid",
          "type": "id_card",
          "name": "National ID",
          "status": "approved",
          "url": "url"
        }
      ],
      "progress": 100
    },
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

#### POST `/`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Request:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "password": "string",
  "roles": ["tenant", "landlord"],
  "dateOfBirth": "1995-05-15",
  "gender": "male"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "uuid"
  }
}
```

#### PATCH `/:id/suspend`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "User suspended successfully"
}
```

#### PATCH `/:id/reactivate`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "User reactivated successfully"
}
```

#### PATCH `/:id/ban`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "User banned successfully"
}
```

#### DELETE `/:id`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### POST `/:id/background-check/documents/:docId/approve`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "Document approved successfully"
}
```

#### POST `/:id/background-check/documents/:docId/reject`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Request:**
```json
{
  "reason": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Document rejected"
}
```

#### POST `/:id/background-check/documents/upload`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Request:** (multipart/form-data)
```json
{
  "documentType": "id_card|proof_of_income|employment_letter",
  "file": File
}
```
**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "documentId": "uuid"
  }
}
```

#### POST `/:id/message`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Request:**
```json
{
  "message": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Conversation created",
  "data": {
    "conversationId": "uuid"
  }
}
```

### 11.3 Property Management (`/api/v1/admin/properties`)

#### GET `/`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Query Params:** `?page=1&limit=20&status=pending&city=Lagos`
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
        "annualRent": 1200000,
        "images": ["url1", "url2"],
        "status": "pending",
        "landlord": {
          "id": "uuid",
          "name": "string"
        },
        "createdAt": "2025-11-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "totalPages": 25
    }
  }
}
```

#### GET `/:id`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
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
    "images": ["url1", "url2", "url3", "url4"],
    "status": "pending",
    "landlord": {
      "id": "uuid",
      "name": "string",
      "email": "string"
    },
    "createdAt": "2025-11-15T10:00:00Z"
  }
}
```

#### PATCH `/:id/approve`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "Property approved successfully"
}
```

#### PATCH `/:id/reject`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Request:**
```json
{
  "reason": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Property rejected"
}
```

#### PATCH `/:id/suspend`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "Property suspended successfully"
}
```

#### PATCH `/:id/reactivate`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "Property reactivated successfully"
}
```

#### DELETE `/:id`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

### 11.4 Service Management (`/api/v1/admin/services`)

#### GET `/`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Query Params:** `?page=1&limit=20&status=pending&category=cleaning`
**Response:**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "uuid",
        "name": "string",
        "category": "cleaning",
        "provider": {
          "id": "uuid",
          "name": "string"
        },
        "status": "pending",
        "averageRating": 4.5,
        "totalBookings": 50,
        "createdAt": "2025-11-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 200,
      "totalPages": 10
    }
  }
}
```

#### GET `/:id`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "text",
    "category": "cleaning",
    "pricing": {
      "basePrice": 8000,
      "priceType": "per_room"
    },
    "provider": {
      "id": "uuid",
      "name": "string",
      "email": "string"
    },
    "status": "pending",
    "createdAt": "2025-11-15T10:00:00Z"
  }
}
```

#### PATCH `/:id/approve`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "Service approved successfully"
}
```

#### PATCH `/:id/reject`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Request:**
```json
{
  "reason": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Service rejected"
}
```

#### PATCH `/:id/suspend`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "Service suspended successfully"
}
```

#### PATCH `/:id/reactivate`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "Service reactivated successfully"
}
```

#### DELETE `/:id`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

### 11.5 Payment Management (`/api/v1/admin/payments`)

#### GET `/`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Query Params:** `?page=1&limit=20&sortBy=amount&sortDirection=desc&status=pending`
**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "uuid",
        "userId": "uuid",
        "userName": "string",
        "paymentType": "rent",
        "totalAmount": 1218000,
        "status": "pending",
        "paymentMethod": "card",
        "createdAt": "2025-11-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "totalPages": 25
    }
  }
}
```

#### GET `/:id`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "userName": "string",
    "paymentType": "rent",
    "items": [
      { "description": "Annual Rent", "amount": 1200000 }
    ],
    "subtotal": 1200000,
    "processingFee": 18000,
    "totalAmount": 1218000,
    "paymentMethod": "card",
    "paymentReference": "string",
    "status": "pending",
    "createdAt": "2025-11-15T10:00:00Z"
  }
}
```

#### POST `/:id/refund`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Request:**
```json
{
  "amount": 1218000,
      "reason": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Refund initiated successfully",
  "data": {
    "refundId": "uuid",
    "status": "processing"
  }
}
```

#### PATCH `/:id/approve`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "Payment approved successfully"
}
```

#### PATCH `/:id/reject`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Request:**
```json
{
  "reason": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Payment rejected"
}
```

### 11.6 Dispute Management (`/api/v1/admin/disputes`)

#### GET `/`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Query Params:** `?page=1&limit=20&status=open`
**Response:**
```json
{
  "success": true,
  "data": {
    "disputes": [
      {
        "id": "uuid",
        "reference": "DISP-2025-001",
        "type": "payment",
        "complainant": {
          "id": "uuid",
          "name": "string"
        },
        "respondent": {
          "id": "uuid",
          "name": "string"
        },
        "status": "open",
        "messageCount": 8,
        "conversationId": "uuid",
        "createdAt": "2025-11-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### GET `/:id`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "reference": "DISP-2025-001",
    "type": "payment",
    "complainant": {
      "id": "uuid",
      "name": "string",
      "email": "string"
    },
    "respondent": {
      "id": "uuid",
      "name": "string",
      "email": "string"
    },
    "description": "text",
    "documents": [
      {
        "id": "uuid",
        "name": "string",
        "type": "image|pdf",
        "url": "url"
      }
    ],
    "status": "open",
    "conversationId": "uuid",
    "createdAt": "2025-11-15T10:00:00Z"
  }
}
```

#### POST `/:id/message`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Request:**
```json
{
  "message": "string",
  "recipients": "both|complainant|respondent"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Message sent and conversation created",
  "data": {
    "conversationId": "uuid",
    "messageId": "uuid"
  }
}
```

#### PATCH `/:id/resolve`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Request:**
```json
{
  "resolution": "in_favor_of_complainant|in_favor_of_respondent|closed_without_resolution",
  "notes": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Dispute resolved successfully"
}
```

### 11.7 Background Check Management (`/api/v1/admin/background-checks`)

#### GET `/`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Query Params:** `?page=1&limit=20&status=pending`
**Response:**
```json
{
  "success": true,
  "data": {
    "backgroundChecks": [
      {
        "id": "uuid",
        "userId": "uuid",
        "userName": "string",
        "status": "pending",
        "progress": 75,
        "documents": [
          {
            "id": "uuid",
            "type": "id_card",
            "name": "National ID",
            "status": "approved"
          }
        ],
        "submittedAt": "2025-11-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 200,
      "totalPages": 10
    }
  }
}
```

#### GET `/:id`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "userName": "string",
    "status": "pending",
    "progress": 75,
    "documents": [
      {
        "id": "uuid",
        "type": "id_card",
        "name": "National ID",
        "status": "approved",
        "url": "url"
      }
    ],
    "submittedAt": "2025-11-15T10:00:00Z"
  }
}
```

#### GET `/:id/documents/:docId`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "id_card",
    "name": "National ID",
    "status": "approved",
    "url": "url",
    "uploadedAt": "2025-11-15T10:00:00Z"
  }
}
```

#### POST `/:id/documents/:docId/approve`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "Document approved successfully"
}
```

#### POST `/:id/documents/:docId/reject`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Request:**
```json
{
  "reason": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Document rejected"
}
```

#### POST `/:id/approve`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Response:**
```json
{
  "success": true,
  "message": "Background check approved successfully"
}
```

#### POST `/:id/reject`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Request:**
```json
{
  "reason": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Background check rejected"
}
```

---

## 12. Services & Service Bookings APIs

### 12.1 Services (`/api/v1/services`)

#### GET `/categories`
**Description:** Get all service categories
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Cleaning",
      "slug": "cleaning",
      "description": "Professional cleaning services",
      "icon": "url",
      "serviceCount": 45
    },
    {
      "id": "uuid",
      "name": "Moving",
      "slug": "moving",
      "description": "Relocation and moving services",
      "icon": "url",
      "serviceCount": 28
    },
    {
      "id": "uuid",
      "name": "Maintenance",
      "slug": "maintenance",
      "description": "Home maintenance services",
      "icon": "url",
      "serviceCount": 62
    }
  ]
}
```

#### GET `/`
**Query Params:** `?category=cleaning&city=Lagos&minPrice=5000&maxPrice=50000&page=1&limit=20`
**Response:**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "uuid",
        "name": "Deep Cleaning Service",
        "category": "cleaning",
        "provider": {
          "id": "uuid",
          "name": "CleanPro Services",
          "rating": 4.8,
          "reviewCount": 156
        },
        "price": {
          "amount": 25000,
          "currency": "NGN",
          "unit": "per session"
        },
        "description": "Comprehensive deep cleaning",
        "image": "url",
        "availability": "available"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 85,
      "totalPages": 5
    }
  }
}
```

#### POST `/` (Service Provider)
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: service_provider`
**Request:**
```json
{
  "name": "string",
  "categoryId": "uuid",
  "description": "text",
  "price": {
    "amount": 25000,
    "currency": "NGN",
    "unit": "per session"
  },
  "images": ["url"],
  "availability": {
    "days": ["monday", "tuesday", "wednesday"],
    "hours": "9am - 6pm"
  },
  "locations": ["Lagos", "Abuja"]
}
```
**Response:**
```json
{
  "success": true,
  "message": "Service created successfully (pending approval)",
  "data": {
    "id": "uuid",
    "status": "pending_approval"
  }
}
```

### 12.2 Service Bookings (`/api/v1/bookings/services`)

#### POST `/`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:**
```json
{
  "serviceId": "uuid",
  "scheduledDate": "2025-12-01",
  "scheduledTime": "10:00",
  "location": {
    "address": "string",
    "city": "Lagos",
    "state": "Lagos",
    "coordinates": {
      "lat": 6.5244,
      "lng": 3.3792
    }
  },
  "notes": "Please bring cleaning supplies",
  "isRecurring": false
}
```
**Response:**
```json
{
  "success": true,
  "message": "Service booked successfully",
  "data": {
    "bookingId": "uuid",
    "reference": "SVC-2025-001",
    "status": "pending_confirmation",
    "totalAmount": 25000
  }
}
```

---

## 13. Artisans APIs

### 13.1 Artisan Registration & Profile (`/api/v1/artisans`)

#### POST `/register`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:**
```json
{
  "specializations": ["electrical", "plumbing"],
  "yearsOfExperience": 5,
  "certifications": [
    {
      "name": "Licensed Electrician",
      "issuer": "NECA",
      "documentUrl": "url"
    }
  ],
  "serviceArea": {
    "cities": ["Lagos", "Ikeja"],
    "radius": 15
  },
  "availability": {
    "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
    "hours": "8am - 6pm"
  },
  "pricing": {
    "diagnosticFee": 5000,
    "hourlyRate": 8000
  }
}
```
**Response:**
```json
{
  "success": true,
  "message": "Artisan registration submitted (pending verification)",
  "data": {
    "artisanId": "uuid",
    "status": "pending_verification"
  }
}
```

#### POST `/service-request`
**Headers:** `Authorization: Bearer {accessToken}`
**Description:** Customer creates a service request
**Request:** (multipart/form-data)
```json
{
  "category": "electrical",
  "problemDescription": "Power outlet not working in bedroom",
  "urgency": "normal",
  "preferredDate": "2025-12-01",
  "location": {
    "address": "string",
    "city": "Lagos",
    "coordinates": {
      "lat": 6.5244,
      "lng": 3.3792
    }
  },
  "photos": [File, File],
  "videos": [File]
}
```
**Response:**
```json
{
  "success": true,
  "message": "Service request created. Finding matches...",
  "data": {
    "requestId": "uuid",
    "reference": "ART-REQ-2025-001",
    "matchingStatus": "in_progress"
  }
}
```

#### GET `/matching/:requestId`
**Headers:** `Authorization: Bearer {accessToken}`
**Description:** Get AI-matched artisans for a request
**Response:**
```json
{
  "success": true,
  "data": {
    "requestId": "uuid",
    "matches": [
      {
        "artisanId": "uuid",
        "name": "John Electrician",
        "matchScore": 95,
        "specialization": "electrical",
        "rating": 4.9,
        "completedJobs": 234,
        "distance": 3.2,
        "availability": "Available today",
        "estimatedArrival": "45 minutes",
        "diagnosticFee": 5000,
        "profilePicture": "url"
      }
    ]
  }
}
```

#### POST `/diagnostic/:bookingId/pay`
**Headers:** `Authorization: Bearer {accessToken}`
**Description:** Pay diagnostic fee to begin assessment
**Request:**
```json
{
  "paymentMethod": "card"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Diagnostic fee payment initiated",
  "data": {
    "paymentId": "uuid",
    "paymentUrl": "paystack_url",
    "amount": 5000
  }
}
```

#### GET `/quotes/:requestId`
**Headers:** `Authorization: Bearer {accessToken}`
**Description:** Get service quotes from artisans
**Response:**
```json
{
  "success": true,
  "data": {
    "quotes": [
      {
        "quoteId": "uuid",
        "artisan": {
          "id": "uuid",
          "name": "John Electrician",
          "rating": 4.9
        },
        "breakdown": [
          {
            "item": "Power outlet replacement",
            "quantity": 2,
            "unitPrice": 8000,
            "total": 16000
          },
          {
            "item": "Wiring repair",
            "quantity": 1,
            "unitPrice": 12000,
            "total": 12000
          }
        ],
        "laborCost": 15000,
        "materialsCost": 28000,
        "totalCost": 43000,
        "estimatedDuration": "3-4 hours",
        "warranty": "6 months",
        "validUntil": "2025-12-05T23:59:59Z"
      }
    ]
  }
}
```

#### POST `/quotes/:quoteId/accept`
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "message": "Quote accepted. Proceeding to payment.",
  "data": {
    "bookingId": "uuid",
    "paymentId": "uuid",
    "totalAmount": 43000
  }
}
```

### 13.2 Artisan Job Management

#### GET `/bookings` (Artisan)
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: artisan`
**Query Params:** `?status=active&page=1&limit=20`
**Response:**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "reference": "ART-JOB-2025-001",
        "customer": {
          "name": "Jane Doe",
          "phone": "08012345678"
        },
        "status": "in_progress",
        "scheduledDate": "2025-12-01",
        "location": "15 Allen Avenue, Ikeja",
        "problemType": "electrical",
        "quoteAmount": 43000,
        "diagnosticFeePaid": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1
    }
  }
}
```

#### PATCH `/bookings/:id/status`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: artisan`
**Request:**
```json
{
  "status": "completed",
  "completionNotes": "Replaced 2 power outlets and repaired wiring"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Booking status updated"
}
```

#### POST `/bookings/:id/photos`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: artisan`
**Request:** (multipart/form-data)
```json
{
  "photoType": "before|after",
  "photos": [File, File]
}
```
**Response:**
```json
{
  "success": true,
  "message": "Photos uploaded successfully",
  "data": {
    "photoUrls": ["url1", "url2"]
  }
}
```

---

## 14. Handyman APIs

### 14.1 Handyman Dashboard (`/api/v1/handyman`)

#### GET `/dashboard`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: handyman`
**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "jobsToday": 3,
      "jobsThisWeek": 12,
      "completedJobs": 234,
      "averageRating": 4.8,
      "responseTime": "18 minutes",
      "qualityScore": 92
    },
    "upcomingJobs": [
      {
        "id": "uuid",
        "type": "maintenance",
        "property": "Sky Gardens Apartment",
        "scheduledTime": "2025-12-01T10:00:00Z",
        "location": "Lekki Phase 1",
        "status": "scheduled"
      }
    ],
    "earnings": {
      "today": 25000,
      "thisWeek": 145000,
      "thisMonth": 520000
    }
  }
}
```

#### GET `/jobs`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: handyman`
**Query Params:** `?status=assigned&date=2025-12-01`
**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "reference": "HND-JOB-2025-001",
        "type": "routine_maintenance",
        "property": {
          "name": "Sky Gardens Apartment",
          "address": "15 Admiralty Way, Lekki"
        },
        "client": {
          "name": "Property Manager ABC",
          "phone": "08012345678"
        },
        "scheduledDate": "2025-12-01",
        "scheduledTime": "10:00",
        "estimatedDuration": "2 hours",
        "status": "assigned",
        "priority": "normal"
      }
    ]
  }
}
```

#### GET `/jobs/:id/checklist`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: handyman`
**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "checklist": [
      {
        "id": "uuid",
        "category": "Plumbing",
        "items": [
          {
            "id": "uuid",
            "description": "Check all taps for leaks",
            "completed": true,
            "notes": "All taps working properly"
          },
          {
            "id": "uuid",
            "description": "Inspect toilet flush mechanism",
            "completed": false,
            "notes": null
          }
        ]
      },
      {
        "id": "uuid",
        "category": "Electrical",
        "items": [
          {
            "id": "uuid",
            "description": "Test all power outlets",
            "completed": false,
            "notes": null
          }
        ]
      }
    ],
    "overallProgress": 33
  }
}
```

#### POST `/jobs/:id/checklist`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: handyman`
**Request:**
```json
{
  "itemId": "uuid",
  "completed": true,
  "notes": "All taps working properly",
  "photos": ["url"]
}
```
**Response:**
```json
{
  "success": true,
  "message": "Checklist item updated",
  "data": {
    "overallProgress": 66
  }
}
```

#### POST `/jobs/:id/claim`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: handyman`
**Description:** Claim an available job from the marketplace
**Response:**
```json
{
  "success": true,
  "message": "Job claimed successfully",
  "data": {
    "jobId": "uuid",
    "status": "assigned"
  }
}
```

#### PUT `/jobs/:id/status`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: handyman`
**Request:**
```json
{
  "status": "en_route|started|completed",
  "notes": "string",
  "estimatedArrival": "15 minutes"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Job status updated"
}
```

---

## 15. Homerunner APIs

### 15.1 Homerunner Dashboard (`/api/v1/homerunner`)

#### GET `/dashboard`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: homerunner`
**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "todayViewings": 5,
      "todayInspections": 2,
      "weeklyViewings": 23,
      "completedInspections": 145,
      "averageRating": 4.9,
      "responseTime": "12 minutes"
    },
    "todaySchedule": [
      {
        "type": "viewing",
        "time": "10:00 AM",
        "property": "3 Bedroom Flat, Lekki",
        "client": "John Doe",
        "status": "scheduled"
      },
      {
        "type": "inspection",
        "time": "2:00 PM",
        "property": "Duplex, Victoria Island",
        "client": "Property Manager XYZ",
        "status": "scheduled"
      }
    ],
    "earnings": {
      "today": 15000,
      "thisWeek": 95000,
      "thisMonth": 380000
    }
  }
}
```

#### GET `/inspections`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: homerunner`
**Query Params:** `?status=assigned&date=2025-12-01`
**Response:**
```json
{
  "success": true,
  "data": {
    "inspections": [
      {
        "id": "uuid",
        "reference": "INS-2025-001",
        "property": {
          "id": "uuid",
          "title": "3 Bedroom Flat",
          "address": "15 Allen Avenue, Ikeja"
        },
        "type": "move_in|move_out|routine",
        "scheduledDate": "2025-12-01",
        "scheduledTime": "14:00",
        "status": "assigned",
        "landlord": {
          "name": "Mr. Adeleke",
          "phone": "08012345678"
        }
      }
    ]
  }
}
```

#### POST `/inspections/:id/report`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: homerunner`
**Request:** (multipart/form-data)
```json
{
  "inspectionType": "move_in",
  "overallCondition": "good|fair|poor",
  "rooms": [
    {
      "name": "Living Room",
      "condition": "good",
      "issues": [],
      "photos": [File]
    },
    {
      "name": "Bedroom 1",
      "condition": "fair",
      "issues": ["Small crack on wall", "Paint peeling in corner"],
      "photos": [File, File]
    }
  ],
  "utilities": {
    "electricity": "working",
    "water": "working",
    "gas": "not_applicable"
  },
  "meterReadings": {
    "electricity": "12345",
    "water": "6789"
  },
  "generalNotes": "Property is in good condition overall",
  "recommendedActions": ["Repair wall crack in bedroom 1"],
  "signature": "base64_signature"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Inspection report submitted successfully",
  "data": {
    "reportId": "uuid",
    "inspectionId": "uuid",
    "status": "completed"
  }
}
```

#### GET `/viewings`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: homerunner`
**Response:**
```json
{
  "success": true,
  "data": {
    "viewings": [
      {
        "id": "uuid",
        "reference": "VIEW-2025-001",
        "property": {
          "id": "uuid",
          "title": "2 Bedroom Apartment",
          "address": "25 Bourdillon Road, Ikoyi"
        },
        "tenant": {
          "name": "Jane Smith",
          "phone": "08098765432"
        },
        "scheduledDate": "2025-12-01",
        "scheduledTime": "10:00",
        "status": "scheduled",
        "notes": "Tenant prefers ground floor"
      }
    ]
  }
}
```

#### PUT `/viewings/:id/status`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: homerunner`
**Request:**
```json
{
  "status": "completed|cancelled|no_show",
  "tenantFeedback": "Very interested, wants to proceed with application",
  "attendanceConfirmed": true
}
```
**Response:**
```json
{
  "success": true,
  "message": "Viewing status updated"
}
```

#### POST `/viewings/:id/notes`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: homerunner`
**Request:**
```json
{
  "notes": "Tenant asked about proximity to schools. Very impressed with kitchen space.",
  "tenantInterestLevel": "high|medium|low"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Notes added successfully"
}
```

#### POST `/quick-actions/note`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: homerunner`
**Description:** Log a quick note during field work
**Request:**
```json
{
  "relatedTo": "viewing|inspection",
  "relatedId": "uuid",
  "note": "Property key collected from landlord"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Note logged"
}
```

---

## 16. Property Management APIs

### 16.1 Property Management Dashboard (`/api/v1/property-management`)

#### GET `/dashboard`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: property_manager`
**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalProperties": 25,
      "totalTenants": 78,
      "occupancyRate": 92.5,
      "pendingMaintenance": 8,
      "rentCollectionRate": 88.2,
      "monthlyRevenue": 15600000
    },
    "recentActivity": [
      {
        "type": "maintenance_request",
        "description": "Plumbing issue - Apt 12B",
        "timestamp": "2025-12-01T09:30:00Z",
        "priority": "high"
      },
      {
        "type": "rent_payment",
        "description": "Rent received - Apt 5A",
        "amount": 800000,
        "timestamp": "2025-12-01T08:15:00Z"
      }
    ],
    "upcomingTasks": [
      {
        "type": "inspection",
        "property": "Block A, Unit 3",
        "scheduledDate": "2025-12-05",
        "priority": "normal"
      }
    ]
  }
}
```

#### GET `/tenants`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: property_manager`
**Query Params:** `?propertyId=uuid&status=active&page=1&limit=20`
**Response:**
```json
{
  "success": true,
  "data": {
    "tenants": [
      {
        "id": "uuid",
        "name": "John Tenant",
        "email": "john@example.com",
        "phone": "08012345678",
        "property": "Block A, Unit 12",
        "leaseStart": "2025-01-01",
        "leaseEnd": "2025-12-31",
        "rentAmount": 800000,
        "rentStatus": "paid|overdue",
        "lastPaymentDate": "2025-11-01",
        "nextDueDate": "2025-12-01"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 78,
      "totalPages": 4
    }
  }
}
```

#### GET `/maintenance`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: property_manager`
**Query Params:** `?status=pending&priority=high&page=1&limit=20`
**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "uuid",
        "reference": "MAINT-2025-001",
        "property": "Block A, Unit 12",
        "tenant": "John Tenant",
        "category": "plumbing",
        "description": "Kitchen sink drainage blocked",
        "priority": "high",
        "status": "pending",
        "reportedDate": "2025-12-01T09:30:00Z",
        "photos": ["url1", "url2"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 8,
      "totalPages": 1
    }
  }
}
```

#### POST `/maintenance`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: property_manager`
**Request:**
```json
{
  "propertyId": "uuid",
  "tenantId": "uuid",
  "category": "plumbing|electrical|carpentry|painting|general",
  "description": "Kitchen sink drainage blocked",
  "priority": "low|normal|high|urgent",
  "photos": ["url"]
}
```
**Response:**
```json
{
  "success": true,
  "message": "Maintenance request created",
  "data": {
    "requestId": "uuid",
    "reference": "MAINT-2025-001"
  }
}
```

#### PUT `/maintenance/:id`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: property_manager`
**Request:**
```json
{
  "status": "assigned|in_progress|completed|cancelled",
  "assignedTo": "uuid",
  "scheduledDate": "2025-12-02",
  "notes": "Assigned to John Plumber",
  "completionNotes": "Issue resolved"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Maintenance request updated"
}
```

#### GET `/rent-collection`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: property_manager`
**Query Params:** `?month=12&year=2025&status=overdue`
**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalExpected": 62400000,
      "totalCollected": 55000000,
      "collectionRate": 88.14,
      "outstanding": 7400000,
      "overdueCount": 9
    },
    "rentDetails": [
      {
        "tenantId": "uuid",
        "tenantName": "John Tenant",
        "property": "Block A, Unit 12",
        "rentAmount": 800000,
        "dueDate": "2025-12-01",
        "status": "paid|pending|overdue",
        "paidDate": "2025-12-01",
        "daysOverdue": 0
      }
    ]
  }
}
```

#### POST `/rent-reminders`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: property_manager`
**Request:**
```json
{
  "tenantIds": ["uuid1", "uuid2"],
  "message": "Friendly reminder: Your rent is due on December 1st.",
  "channels": ["email", "sms", "whatsapp"]
}
```
**Response:**
```json
{
  "success": true,
  "message": "Rent reminders sent successfully",
  "data": {
    "sentCount": 2,
    "failedCount": 0
    }
}
```

#### GET `/security`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: property_manager`
**Description:** Get security monitoring data (Premium PM only)
**Response:**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "uuid",
        "property": "Block A",
        "type": "motion_detected|door_open|unusual_activity",
        "timestamp": "2025-12-01T22:30:00Z",
        "resolved": false,
        "cameraId": "uuid"
      }
    ],
    "cameraStatus": {
      "online": 12,
      "offline": 1,
      "total": 13
    }
  }
}
```

#### POST `/security/alert`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: property_manager`
**Request:**
```json
{
  "propertyId": "uuid",
  "alertType": "suspicious_activity|emergency|maintenance_needed",
  "description": "Unknown person loitering in parking lot",
  "severity": "low|medium|high",
  "notifyAuthorities": false
}
```
**Response:**
```json
{
  "success": true,
  "message": "Security alert created",
  "data": {
    "alertId": "uuid",
    "reference": "SEC-ALERT-2025-001"
  }
}
```

---

## 17. Reviews & Ratings APIs

### 17.1 Reviews (`/api/v1/reviews`)

#### POST `/`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:**
```json
{
  "targetType": "property|user|service|artisan|provider",
  "targetId": "uuid",
  "rating": 5,
  "title": "Excellent property!",
  "comment": "Great location, well-maintained, responsive landlord.",
  "aspects": {
    "cleanliness": 5,
    "location": 5,
    "value": 4,
    "communication": 5
  },
  "photos": ["url1", "url2"],
  "wouldRecommend": true
}
```
**Response:**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "reviewId": "uuid",
    "status": "published"
  }
}
```

#### GET `/property/:id`
**Description:** Get reviews for a property
**Query Params:** `?page=1&limit=10&rating=5`
**Response:**
```json
{
  "success": true,
  "data": {
    "averageRating": 4.7,
    "totalReviews": 156,
    "ratingBreakdown": {
      "5": 98,
      "4": 42,
      "3": 12,
      "2": 3,
      "1": 1
    },
    "aspectRatings": {
      "cleanliness": 4.8,
      "location": 4.9,
      "value": 4.5,
      "communication": 4.7
    },
    "reviews": [
      {
        "id": "uuid",
        "reviewer": {
          "name": "John Doe",
          "profilePicture": "url",
          "verifiedTenant": true
        },
        "rating": 5,
        "title": "Excellent property!",
        "comment": "Great location, well-maintained...",
        "aspects": {
          "cleanliness": 5,
          "location": 5,
          "value": 4,
          "communication": 5
        },
        "photos": ["url1", "url2"],
        "wouldRecommend": true,
        "helpful": 23,
        "createdAt": "2025-11-15T10:00:00Z",
        "landlordResponse": {
          "comment": "Thank you for your kind words!",
          "respondedAt": "2025-11-16T08:30:00Z"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 156,
      "totalPages": 16
    }
  }
}
```

#### POST `/:id/response`
**Headers:** `Authorization: Bearer {accessToken}`
**Description:** Respond to a review (for property owners, service providers, etc.)
**Request:**
```json
{
  "comment": "Thank you for your feedback! We're glad you enjoyed your stay."
}
```
**Response:**
```json
{
  "success": true,
  "message": "Response added successfully"
}
```

#### POST `/:id/report`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:**
```json
{
  "reason": "inappropriate|spam|false_information|offensive",
  "details": "This review contains false information about the property"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Review reported. Our team will investigate."
}
```

---

## 18. Verification & Background Checks

### 18.1 Verification Workflow (`/api/v1/verification`)

#### POST `/identity/upload`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:** (multipart/form-data)
```json
{
  "documentType": "nin|passport|drivers_license|voters_card",
  "documentNumber": "string",
  "frontImage": File,
  "backImage": File
}
```
**Response:**
```json
{
  "success": true,
  "message": "Identity document uploaded for verification",
  "data": {
    "verificationId": "uuid",
    "status": "pending",
    "estimatedProcessingTime": "24-48 hours"
  }
}
```

#### POST `/financial/upload`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:** (multipart/form-data)
```json
{
  "documentType": "bank_statement|payslip|employment_letter",
  "documents": [File, File]
}
```
**Response:**
```json
{
  "success": true,
  "message": "Financial documents uploaded"
}
```

#### GET `/status`
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "data": {
    "overallStatus": "pending|verified|rejected",
    "verificationProgress": 75,
    "checks": {
      "identity": {
        "status": "verified",
        "verifiedAt": "2025-11-20T10:00:00Z"
      },
      "financial": {
        "status": "pending",
        "documents": 2
      },
      "background": {
        "status": "not_started"
      }
    },
    "verifiedBadges": ["identity_verified", "financial_verified"]
  }
}
```

---

## 19. Search & Discovery APIs

### 19.1 Advanced Search (`/api/v1/search`)

#### POST `/properties`
**Description:** Advanced property search with multiple filters
**Request:**
```json
{
  "query": "3 bedroom apartment",
  "filters": {
    "location": {
      "city": "Lagos",
      "areas": ["Lekki", "Victoria Island"],
      "coordinates": {
        "lat": 6.4281,
        "lng": 3.4219,
        "radius": 5
      }
    },
    "price": {
      "min": 500000,
      "max": 2000000
    },
    "propertyType": ["apartment", "duplex"],
    "bedrooms": {
      "min": 3,
      "max": 4
    },
    "bathrooms": {
      "min": 2
    },
    "amenities": ["parking", "generator", "security"],
    "rentalCategory": "long_term|shortlet|both",
    "moveInDate": "2025-12-01",
    "verified": true,
    "petsAllowed": false
  },
  "sort": {
    "by": "price|date_listed|relevance|rating",
    "direction": "asc|desc"
  },
  "page": 1,
  "limit": 20
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "results": [...],
    "facets": {
      "priceRanges": [
        {"range": "500k-1M", "count": 45},
        {"range": "1M-1.5M", "count": 32}
      ],
      "areas": [
        {"name": "Lekki", "count": 28},
        {"name": "Victoria Island", "count": 19}
      ]
    },
    "pagination": {...}
  }
}
```

#### GET `/saved-searches`
**Headers:** `Authorization: Bearer {accessToken}`
**Response:**
```json
{
  "success": true,
  "data": {
    "searches": [
      {
        "id": "uuid",
        "name": "3BR in Lekki",
        "criteria": {...},
        "alertsEnabled": true,
        "newResults": 5,
        "createdAt": "2025-11-01T10:00:00Z"
      }
    ]
  }
}
```

#### POST `/saved-searches`
**Headers:** `Authorization: Bearer {accessToken}`
**Request:**
```json
{
  "name": "3BR in Lekki under 1.5M",
  "criteria": {...},
  "alertsEnabled": true
}
```
**Response:**
```json
{
  "success": true,
  "message": "Search saved successfully",
  "data": {
    "searchId": "uuid"
  }
}
```

---

## 20. Analytics & Reporting

### 20.1 Platform Analytics (`/api/v1/analytics`)

#### GET `/platform/overview`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: admin`
**Query Params:** `?period=30d&startDate=2025-11-01&endDate=2025-11-30`
**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 15234,
      "active": 8765,
      "newThisMonth": 1234,
      "growth": 12.5
    },
    "properties": {
      "total": 5678,
      "active": 4532,
      "newThisMonth": 234,
      "occupancyRate": 87.3
    },
    "revenue": {
      "total": 125000000,
      "commission": 15600000,
      "growth": 23.4,
      "breakdown": {
        "rentals": 98000000,
        "services": 18000000,
        "artisans": 9000000
      }
    },
    "bookings": {
      "total": 2345,
      "completed": 1876,
      "cancelled": 123,
      "conversionRate": 32.5
    }
  }
}
```

#### GET `/landlord/property-performance`
**Headers:** `Authorization: Bearer {accessToken}`, `X-Active-Role: landlord`
**Query Params:** `?propertyId=uuid&period=90d`
**Response:**
```json
{
  "success": true,
  "data": {
    "propertyId": "uuid",
    "period": "90d",
    "views": {
      "total": 1245,
      "unique": 876,
      "trend": "+15%"
    },
    "inquiries": {
      "total": 123,
      "responded": 118,
      "responseRate": 95.9
    },
    "viewingRequests": {
      "total": 45,
      "completed": 38,
      "conversionRate": 84.4
    },
    "applications": {
      "total": 12,
      "approved": 1,
      "pending": 2,
      "rejected": 9
    },
    "revenue": {
      "total": 2400000,
      "commission": 192000,
      "occupancyDays": 90
    },
    "marketComparison": {
      "averagePriceInArea": 850000,
      "yourPrice": 800000,
      "pricePercentile": 65
    }
  }
}
```

---

**Document Version:** 2.0  
**Last Updated:** December 2025  
**Prepared By:** JulaazNG Development Team

