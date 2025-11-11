# JulaazNG Backend

## 🎯 Overview
Production-ready NestJS + TypeScript backend API for JulaazNG - Nigeria's comprehensive property rental and services marketplace platform.

## 🏗️ Architecture
This project uses **Domain-Driven Design (DDD)** with **Clean Architecture** principles:
- **Clear separation** between business logic and infrastructure
- **Modular structure** with feature-based organization
- **Scalable architecture** that supports microservices migration
- **Testable code** with dependency injection

### Architecture Layers:
1. **`common/`** - Shared utilities, decorators, guards, interceptors
2. **`infrastructure/`** - External services, database, cache, queues
3. **`modules/`** - Business domain modules (core logic)
4. **`api/`** - REST API controllers and DTOs
5. **`config/`** - Application configuration
6. **`main.ts`** - Application bootstrap

## 📦 Tech Stack

### Core Technologies
- **Framework:** NestJS 10 with TypeScript
- **Database:** PostgreSQL 16
- **ORM:** Prisma 5
- **Authentication:** JWT (access + refresh tokens)
- **Caching:** Redis
- **Queue:** BullMQ
- **Real-time:** Socket.IO (WebSocket)
- **Validation:** class-validator + class-transformer
- **Documentation:** Swagger/OpenAPI
- **File Storage:** Cloudinary (MVP) / AWS S3 (Scale)
- **Search:** TypeORM Full-text search / Typesense

### Third-Party Integrations
- **Payment:** Paystack, Flutterwave
- **Notifications:** 
  - Firebase Cloud Messaging (FCM) - Push
  - SendGrid / Resend - Email
  - Termii - SMS
- **Maps:** Google Maps API / Mapbox
- **AI:** OpenAI API (LangChain)
- **Monitoring:** Sentry, LogRocket

### Development Tools
- **Testing:** Jest + Supertest
- **Linting:** ESLint + Prettier
- **Git Hooks:** Husky
- **Documentation:** Compodoc
- **API Testing:** Postman/Insomnia collections

## 🔐 Multi-Role Authentication Expectations
- Authentication responses must include the complete list of user roles (`roles: UserRole[]`) and the most recent `preferredRole`.
- All protected routes expect clients to send `X-Active-Role` header containing one of the user's assigned roles; middleware should enforce the mapping between header and stored roles.
- Seed script (`npm run prisma:seed`) provisions demo accounts:
  - `tenant@julaaz.com` / `tenant123` → Tenant
  - `landlord@julaaz.com` / `landlord123` → Landlord
  - `hybrid@julaaz.com` / `hybrid123` → Tenant + Landlord
- Update authorization guards to read the active role from the header rather than a single-role field.

## 📁 Project Structure

```
backend/
├── prisma/                          # Prisma ORM
│   ├── migrations/                  # Database migrations
│   ├── seeds/                       # Seed data
│   └── schema.prisma                # Database schema
│
├── src/
│   ├── main.ts                      # Application entry point
│   ├── app.module.ts                # Root application module
│   │
│   ├── config/                      # Configuration management
│   │   ├── app.config.ts            # App configuration
│   │   ├── database.config.ts       # Database config
│   │   ├── redis.config.ts          # Redis config
│   │   ├── jwt.config.ts            # JWT config
│   │   ├── cloudinary.config.ts     # File storage config
│   │   ├── payment.config.ts        # Payment gateway config
│   │   ├── notification.config.ts   # Notification service config
│   │   └── index.ts                 # Config barrel export
│   │
│   ├── common/                      # Shared utilities
│   │   ├── decorators/              # Custom decorators
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── api-response.decorator.ts
│   │   ├── guards/                  # Auth & role guards
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   ├── throttle.guard.ts
│   │   │   └── permission.guard.ts
│   │   ├── interceptors/            # Request/Response interceptors
│   │   │   ├── transform.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── cache.interceptor.ts
│   │   │   └── timeout.interceptor.ts
│   │   ├── filters/                 # Exception filters
│   │   │   ├── http-exception.filter.ts
│   │   │   ├── prisma-exception.filter.ts
│   │   │   └── all-exceptions.filter.ts
│   │   ├── pipes/                   # Validation pipes
│   │   │   ├── validation.pipe.ts
│   │   │   ├── parse-int.pipe.ts
│   │   │   └── file-validation.pipe.ts
│   │   ├── middlewares/             # HTTP middlewares
│   │   │   ├── logger.middleware.ts
│   │   │   ├── cors.middleware.ts
│   │   │   └── helmet.middleware.ts
│   │   ├── types/                   # Global types
│   │   │   ├── express.d.ts
│   │   │   ├── pagination.types.ts
│   │   │   └── response.types.ts
│   │   ├── constants/               # App constants
│   │   │   ├── roles.constant.ts
│   │   │   ├── permissions.constant.ts
│   │   │   └── error-messages.constant.ts
│   │   ├── utils/                   # Utility functions
│   │   │   ├── hash.util.ts
│   │   │   ├── date.util.ts
│   │   │   ├── currency.util.ts
│   │   │   ├── slug.util.ts
│   │   │   └── file.util.ts
│   │   └── interfaces/              # Common interfaces
│   │       ├── pagination.interface.ts
│   │       └── base-service.interface.ts
│   │
│   ├── infrastructure/              # External services layer
│   │   ├── database/                # Database setup
│   │   │   ├── prisma.service.ts
│   │   │   └── database.module.ts
│   │   ├── cache/                   # Redis cache
│   │   │   ├── cache.service.ts
│   │   │   └── cache.module.ts
│   │   ├── queue/                   # BullMQ queues
│   │   │   ├── queue.service.ts
│   │   │   ├── processors/
│   │   │   │   ├── email.processor.ts
│   │   │   │   ├── notification.processor.ts
│   │   │   │   └── payment.processor.ts
│   │   │   └── queue.module.ts
│   │   ├── storage/                 # File storage
│   │   │   ├── storage.service.ts
│   │   │   ├── cloudinary.service.ts
│   │   │   ├── s3.service.ts
│   │   │   └── storage.module.ts
│   │   ├── email/                   # Email service
│   │   │   ├── email.service.ts
│   │   │   ├── templates/
│   │   │   │   ├── welcome.template.ts
│   │   │   │   ├── verification.template.ts
│   │   │   │   ├── booking-confirmation.template.ts
│   │   │   │   └── payment-receipt.template.ts
│   │   │   └── email.module.ts
│   │   ├── sms/                     # SMS service
│   │   │   ├── sms.service.ts
│   │   │   ├── termii.service.ts
│   │   │   └── sms.module.ts
│   │   ├── push/                    # Push notifications (FCM)
│   │   │   ├── push.service.ts
│   │   │   ├── fcm.service.ts
│   │   │   └── push.module.ts
│   │   ├── payment/                 # Payment gateways
│   │   │   ├── payment.service.ts
│   │   │   ├── paystack/
│   │   │   │   ├── paystack.service.ts
│   │   │   │   └── paystack.types.ts
│   │   │   ├── flutterwave/
│   │   │   │   ├── flutterwave.service.ts
│   │   │   │   └── flutterwave.types.ts
│   │   │   └── payment.module.ts
│   │   ├── ai/                      # AI/ML services
│   │   │   ├── ai.service.ts
│   │   │   ├── openai.service.ts
│   │   │   ├── langchain.service.ts
│   │   │   └── ai.module.ts
│   │   ├── maps/                    # Maps/Geocoding
│   │   │   ├── maps.service.ts
│   │   │   ├── google-maps.service.ts
│   │   │   ├── mapbox.service.ts
│   │   │   └── maps.module.ts
│   │   └── search/                  # Search engine
│   │       ├── search.service.ts
│   │       ├── typesense.service.ts
│   │       └── search.module.ts
│   │
│   ├── modules/                     # Business domain modules
│   │   ├── auth/                    # Authentication & Authorization
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── verify-otp.dto.ts
│   │   │   │   ├── reset-password.dto.ts
│   │   │   │   └── refresh-token.dto.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── jwt-refresh.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   └── tests/
│   │   │       └── auth.service.spec.ts
│   │   │
│   │   ├── users/                   # User management
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── update-user.dto.ts
│   │   │   │   ├── user-profile.dto.ts
│   │   │   │   └── user-query.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── tests/
│   │   │
│   │   ├── properties/              # Property management
│   │   │   ├── properties.module.ts
│   │   │   ├── properties.controller.ts
│   │   │   ├── properties.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-property.dto.ts
│   │   │   │   ├── update-property.dto.ts
│   │   │   │   ├── property-search.dto.ts
│   │   │   │   ├── property-filter.dto.ts
│   │   │   │   └── property-response.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── property.entity.ts
│   │   │   │   ├── property-image.entity.ts
│   │   │   │   └── property-amenity.entity.ts
│   │   │   └── tests/
│   │   │
│   │   ├── bookings/                # Booking system
│   │   │   ├── bookings.module.ts
│   │   │   ├── bookings.controller.ts
│   │   │   ├── bookings.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-booking.dto.ts
│   │   │   │   ├── update-booking.dto.ts
│   │   │   │   ├── booking-response.dto.ts
│   │   │   │   └── viewing-schedule.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── booking.entity.ts
│   │   │   │   └── viewing.entity.ts
│   │   │   └── tests/
│   │   │
│   │   ├── services/                # Service marketplace
│   │   │   ├── services.module.ts
│   │   │   ├── services.controller.ts
│   │   │   ├── services.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-service.dto.ts
│   │   │   │   ├── service-booking.dto.ts
│   │   │   │   └── service-provider.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── service.entity.ts
│   │   │   │   ├── service-category.entity.ts
│   │   │   │   ├── service-booking.entity.ts
│   │   │   │   └── service-provider.entity.ts
│   │   │   └── tests/
│   │   │
│   │   ├── artisans/                # Artisan marketplace
│   │   │   ├── artisans.module.ts
│   │   │   ├── artisans.controller.ts
│   │   │   ├── artisans.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── artisan-registration.dto.ts
│   │   │   │   ├── artisan-profile.dto.ts
│   │   │   │   ├── service-request.dto.ts
│   │   │   │   ├── diagnostic-booking.dto.ts
│   │   │   │   ├── service-quote.dto.ts
│   │   │   │   └── artisan-matching.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── artisan.entity.ts
│   │   │   │   ├── artisan-specialization.entity.ts
│   │   │   │   ├── artisan-booking.entity.ts
│   │   │   │   ├── diagnostic.entity.ts
│   │   │   │   └── service-quote.entity.ts
│   │   │   ├── algorithms/
│   │   │   │   ├── proximity-matching.ts
│   │   │   │   └── skill-matching.ts
│   │   │   └── tests/
│   │   │
│   │   ├── property-management/     # Property management services
│   │   │   ├── property-management.module.ts
│   │   │   ├── property-management.controller.ts
│   │   │   ├── property-management.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── management-subscription.dto.ts
│   │   │   │   ├── rent-collection.dto.ts
│   │   │   │   ├── security-monitoring.dto.ts
│   │   │   │   ├── maintenance-schedule.dto.ts
│   │   │   │   └── conflict-resolution.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── property-management.entity.ts
│   │   │   │   ├── security-camera.entity.ts
│   │   │   │   ├── maintenance-request.entity.ts
│   │   │   │   └── tenant-communication.entity.ts
│   │   │   └── tests/
│   │   │
│   │   ├── payments/                # Payment processing
│   │   │   ├── payments.module.ts
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-payment.dto.ts
│   │   │   │   ├── payment-callback.dto.ts
│   │   │   │   ├── refund.dto.ts
│   │   │   │   └── payment-response.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── payment.entity.ts
│   │   │   │   ├── transaction.entity.ts
│   │   │   │   └── commission.entity.ts
│   │   │   └── tests/
│   │   │
│   │   ├── messaging/               # Real-time messaging
│   │   │   ├── messaging.module.ts
│   │   │   ├── messaging.gateway.ts
│   │   │   ├── messaging.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── send-message.dto.ts
│   │   │   │   ├── conversation.dto.ts
│   │   │   │   └── message-response.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── message.entity.ts
│   │   │   │   └── conversation.entity.ts
│   │   │   └── tests/
│   │   │
│   │   ├── notifications/           # Notification system
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-notification.dto.ts
│   │   │   │   ├── notification-preference.dto.ts
│   │   │   │   └── notification-response.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── notification.entity.ts
│   │   │   │   └── notification-preference.entity.ts
│   │   │   └── tests/
│   │   │
│   │   ├── verification/            # User verification
│   │   │   ├── verification.module.ts
│   │   │   ├── verification.controller.ts
│   │   │   ├── verification.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── submit-verification.dto.ts
│   │   │   │   ├── verify-document.dto.ts
│   │   │   │   └── verification-status.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── verification.entity.ts
│   │   │   │   └── verification-document.entity.ts
│   │   │   └── tests/
│   │   │
│   │   ├── reviews/                 # Review & rating system
│   │   │   ├── reviews.module.ts
│   │   │   ├── reviews.controller.ts
│   │   │   ├── reviews.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-review.dto.ts
│   │   │   │   ├── update-review.dto.ts
│   │   │   │   └── review-response.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── review.entity.ts
│   │   │   └── tests/
│   │   │
│   │   ├── analytics/               # Analytics & reporting
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── analytics-query.dto.ts
│   │   │   │   └── analytics-response.dto.ts
│   │   │   └── tests/
│   │   │
│   │   └── admin/                   # Admin operations
│   │       ├── admin.module.ts
│   │       ├── admin.controller.ts
│   │       ├── admin.service.ts
│   │       ├── dto/
│   │       │   ├── user-moderation.dto.ts
│   │       │   ├── property-approval.dto.ts
│   │       │   ├── dispute-resolution.dto.ts
│   │       │   └── admin-analytics.dto.ts
│   │       └── tests/
│   │
│   └── health/                      # Health check module
│       ├── health.module.ts
│       └── health.controller.ts
│
├── test/                            # E2E tests
│   ├── app.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   ├── properties.e2e-spec.ts
│   └── jest-e2e.json
│
├── docs/                            # Documentation
│   ├── api/                         # API documentation
│   ├── architecture/                # Architecture docs
│   └── deployment/                  # Deployment guides
│
├── scripts/                         # Utility scripts
│   ├── seed.ts                      # Database seeding
│   ├── migrate.ts                   # Migration runner
│   └── generate-keys.ts             # JWT key generation
│
├── .github/                         # GitHub configuration
│   └── workflows/                   # CI/CD workflows
│       ├── ci.yml                   # Continuous Integration
│       ├── deploy.yml               # Deployment
│       └── test.yml                 # Automated testing
│
├── .husky/                          # Git hooks
│   └── pre-commit                   # Pre-commit checks
│
├── .env.example                     # Environment variables template
├── .eslintrc.js                     # ESLint configuration
├── .gitignore                       # Git ignore rules
├── .prettierrc                      # Prettier configuration
├── docker-compose.yml               # Docker services setup
├── Dockerfile                       # Docker container config
├── nest-cli.json                    # NestJS CLI config
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.build.json              # TypeScript build config
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL 16.x
- Redis 7.x (optional for development)
- Docker & Docker Compose (optional)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start PostgreSQL and Redis (using Docker)
docker-compose up -d postgres redis

# Run database migrations
npm run prisma:migrate

# Seed database with initial data
npm run prisma:seed

# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

## 🗄️ Database Management

### Prisma Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Create a migration
npm run prisma:migrate:dev

# Run migrations in production
npm run prisma:migrate:deploy

# Seed database
npm run prisma:seed

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Reset database (WARNING: Deletes all data)
npm run prisma:reset
```

### Database Schema
The database schema is defined in `prisma/schema.prisma` and includes:
- **Users** - Multi-role user system
- **Properties** - Property listings with media and amenities
- **Bookings** - Rental bookings with status tracking
- **Services** - Service marketplace with providers
- **Artisans** - Artisan profiles and bookings
- **PropertyManagement** - Property management subscriptions
- **Payments** - Payment transactions and commissions
- **Messages** - Real-time messaging
- **Notifications** - Multi-channel notifications
- **Reviews** - Bidirectional review system
- **Verifications** - User and document verification

## 🔐 Authentication & Authorization

### JWT Strategy
- **Access Token**: Short-lived (15 minutes), stored in HTTP-only cookie
- **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie
- **Token Rotation**: Automatic refresh on expiration

### Role-Based Access Control (RBAC)

```typescript
enum UserRole {
  TENANT = 'tenant',
  LANDLORD = 'landlord',
  SERVICE_PROVIDER = 'service_provider',
  ARTISAN = 'artisan',
  PROPERTY_MANAGER = 'property_manager',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}
```

### Protected Routes

```typescript
// Using guards and decorators
@Controller('properties')
@UseGuards(JwtAuthGuard)
export class PropertiesController {
  
  @Get()
  @Public() // Public route
  findAll() {}
  
  @Post()
  @Roles(UserRole.LANDLORD) // Role-based access
  create() {}
  
  @Patch(':id')
  @Permissions('properties:update') // Permission-based access
  update() {}
}
```

## 📡 API Documentation

### Swagger/OpenAPI
API documentation is automatically generated and available at:
- Development: `http://localhost:3000/api/docs`
- Production: `https://api.julaazng.com/docs`

### API Versioning
```typescript
// Version prefix
@Controller('v1/properties')

// Version header
@Header('API-Version', 'v1')
```

### Response Format

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": "2025-11-05T12:00:00.000Z"
}
```

### Error Format

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
  },
  "timestamp": "2025-11-05T12:00:00.000Z"
}
```

## 🔄 Real-time Features

### WebSocket Gateway (Socket.IO)

```typescript
// Messaging gateway
@WebSocketGateway({
  namespace: '/messages',
  cors: { origin: process.env.FRONTEND_URL }
})
export class MessagingGateway {
  
  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() data: SendMessageDto) {
    // Handle real-time messaging
  }
}
```

### Events
- **Message Events**: `send_message`, `message_delivered`, `message_read`
- **Notification Events**: `new_notification`, `notification_read`
- **Booking Events**: `booking_status_update`
- **Presence Events**: `user_online`, `user_offline`, `typing`

## 💳 Payment Integration

### Paystack Integration

```typescript
// Initialize payment
POST /v1/payments/initialize
{
  "amount": 50000,
  "email": "user@example.com",
  "reference": "unique_ref",
  "callback_url": "https://frontend.com/payment/callback"
}

// Webhook endpoint
POST /v1/payments/paystack/webhook
// Verify webhook signature
// Process payment status
```

### Flutterwave Integration

```typescript
// Similar structure as Paystack
POST /v1/payments/flutterwave/initialize
POST /v1/payments/flutterwave/webhook
```

## 📧 Notification System

### Multi-Channel Notifications

```typescript
interface NotificationChannels {
  email: boolean;      // SendGrid/Resend
  sms: boolean;        // Termii
  push: boolean;       // Firebase Cloud Messaging
  inApp: boolean;      // Database + WebSocket
  whatsapp: boolean;   // WhatsApp Business API
}
```

### Notification Types
- **Booking**: Confirmation, viewing scheduled, status updates
- **Payment**: Payment received, payment reminder, refund processed
- **Service**: Service booked, service completed
- **Artisan**: Diagnostic scheduled, quote received
- **Property Management**: Rent due, maintenance scheduled
- **Admin**: Moderation required, dispute opened

### Queue Processing
Notifications are processed asynchronously using BullMQ:

```typescript
// Add job to queue
await this.notificationQueue.add('send-email', {
  to: 'user@example.com',
  template: 'booking-confirmation',
  data: { bookingId: '123' }
});
```

## 🔍 Search Implementation

### PostgreSQL Full-Text Search

```typescript
// Property search with full-text
await this.prisma.property.findMany({
  where: {
    OR: [
      { title: { search: searchQuery } },
      { description: { search: searchQuery } }
    ],
    status: 'AVAILABLE'
  }
});
```

### Advanced Filtering

```typescript
// Complex property search
interface PropertySearchQuery {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  propertyType?: PropertyType;
  amenities?: string[];
  radius?: number; // km from coordinates
}
```

## 🤖 AI/ML Features

### Property Recommendations

```typescript
// AI-powered property matching
POST /v1/ai/recommend-properties
{
  "userId": "user-id",
  "preferences": {
    "location": "Lagos",
    "budget": 500000,
    "bedrooms": 3
  }
}
```

### Artisan Matching Algorithm

```typescript
// Proximity + skill-based matching
interface ArtisanMatchingParams {
  location: { lat: number; lng: number };
  specialization: ArtisanSpecialization;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  maxDistance: number; // km
}

// Returns: Top 5 artisans based on:
// 1. Proximity (within radius)
// 2. Rating & reviews
// 3. Completion rate
// 4. Availability
// 5. Specialization match
```

### Chatbot Integration

```typescript
// OpenAI-powered customer support
POST /v1/ai/chat
{
  "message": "I need help finding a property",
  "context": {
    "userId": "user-id",
    "conversationId": "conv-id"
  }
}
```

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### E2E Tests

```bash
# Run e2e tests
npm run test:e2e

# Run e2e tests with specific file
npm run test:e2e -- auth.e2e-spec
```

### Test Structure

```typescript
describe('PropertiesService', () => {
  let service: PropertiesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PropertiesService, PrismaService]
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a property', async () => {
    // Test implementation
  });
});
```

## 📊 Monitoring & Logging

### Winston Logger

```typescript
// Logging levels
logger.error('Error message', { context: 'AuthService' });
logger.warn('Warning message');
logger.log('Info message');
logger.debug('Debug message');
logger.verbose('Verbose message');
```

### Health Checks

```typescript
// Health check endpoint
GET /health

Response:
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" },
    "diskSpace": { "status": "up" }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  }
}
```

## 🐳 Docker Deployment

### Docker Compose

```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up -d postgres redis

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

### Production Deployment

```bash
# Build production image
docker build -t julaazng-backend:latest .

# Run production container
docker run -d \
  -p 3000:3000 \
  --env-file .env.production \
  julaazng-backend:latest
```

## 🔧 Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/julaazng

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:5173

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx

# Flutterwave
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxx
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# SendGrid
SENDGRID_API_KEY=xxxxx
SENDGRID_FROM_EMAIL=noreply@julaazng.com

# Termii (SMS)
TERMII_API_KEY=xxxxx
TERMII_SENDER_ID=JulaazNG

# Firebase Cloud Messaging
FCM_PROJECT_ID=xxxxx
FCM_PRIVATE_KEY=xxxxx
FCM_CLIENT_EMAIL=xxxxx

# Google Maps
GOOGLE_MAPS_API_KEY=xxxxx

# OpenAI
OPENAI_API_KEY=sk-xxxxx

# Sentry (Error Tracking)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

## 🤝 Contributing

### Code Style
- Follow NestJS conventions
- Use TypeScript strict mode
- Write unit tests for services
- Document complex logic
- Use dependency injection

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(auth): add multi-factor authentication
fix(payments): resolve paystack webhook validation
docs(api): update swagger documentation
refactor(properties): optimize search queries
test(bookings): add e2e tests for booking flow
```

## 📄 License

Proprietary - All rights reserved

## 👥 Team

- **Backend Developer:** Solo Developer with AI assistance
- **Architecture:** Domain-Driven Design + Clean Architecture
- **Database:** PostgreSQL with Prisma ORM

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@julaazng.com
- API Status: https://status.julaazng.com

---

**Built with ❤️ for the Nigerian property market**

