# Backend Environment Variables Template

Copy this file's content to `.env` for development or `.env.production` for production.

**IMPORTANT:** Never commit `.env` or `.env.production` to version control!

```bash
# ==================================
# JulaazNG Backend Environment Variables
# ==================================

# ----------------------------------
# Application Configuration
# ----------------------------------
NODE_ENV=development # development, staging, production
PORT=3000
APP_NAME=JulaazNG API
APP_VERSION=1.0.0

# API Configuration
API_PREFIX=api
API_VERSION=v1
API_RATE_LIMIT=100

# Server URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
CORS_CREDENTIALS=true

# ----------------------------------
# Database Configuration
# ----------------------------------
# PostgreSQL Connection URL
DATABASE_URL=postgresql://julaazng:password123@localhost:5432/julaazng_dev

# Individual components (alternative)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=julaazng
DB_PASSWORD=password123
DB_DATABASE=julaazng_dev

# Connection Pool
DB_POOL_MIN=2
DB_POOL_MAX=10

# ----------------------------------
# Redis Configuration
# ----------------------------------
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=3600

# Alternative: Redis URL
REDIS_URL=redis://localhost:6379

# ----------------------------------
# JWT Configuration
# ----------------------------------
# IMPORTANT: Use strong, random secrets in production!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Token Expiration
JWT_EXPIRES_IN=15m # 15 minutes
JWT_REFRESH_EXPIRES_IN=7d # 7 days

# Cookie Configuration
JWT_COOKIE_NAME=julaaz_access_token
JWT_COOKIE_SECURE=false # Set to true in production
JWT_COOKIE_HTTP_ONLY=true

# ----------------------------------
# Encryption & Security
# ----------------------------------
ENCRYPTION_KEY=your-32-character-encryption-key-here
BCRYPT_SALT_ROUNDS=10

# ----------------------------------
# File Storage
# ----------------------------------
# Provider: cloudinary or s3
STORAGE_PROVIDER=cloudinary

# Cloudinary (MVP)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_FOLDER=julaazng

# AWS S3 (Scale)
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=eu-west-1
AWS_S3_BUCKET=julaazng-storage

# ----------------------------------
# Email Configuration
# ----------------------------------
# Provider: sendgrid or resend
EMAIL_PROVIDER=sendgrid

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@julaazng.com
SENDGRID_FROM_NAME=JulaazNG

# Resend (Alternative)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@julaazng.com

# ----------------------------------
# SMS Configuration
# ----------------------------------
# Provider: termii, twilio, or africas-talking
SMS_PROVIDER=termii

# Termii (Nigerian SMS)
TERMII_API_KEY=TLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TERMII_SENDER_ID=JulaazNG
TERMII_CHANNEL=generic

# Twilio (Alternative)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+12345678901

# ----------------------------------
# Push Notifications (Firebase)
# ----------------------------------
FCM_PROJECT_ID=your-project-id
FCM_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FCM_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# Alternative: Service account file path
FCM_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json

# ----------------------------------
# Payment Configuration
# ----------------------------------
# Provider: paystack, flutterwave, or both
PAYMENT_PROVIDER=paystack

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_WEBHOOK_SECRET=your-webhook-secret
PAYSTACK_MODE=test # test or live
PAYSTACK_CALLBACK_URL=http://localhost:5173/payment/callback

# Flutterwave
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TESTxxxxxxxxxxxx
FLUTTERWAVE_MODE=test # test or live

# Commission Rates (%)
RENTAL_COMMISSION_RATE=6
SERVICE_COMMISSION_RATE=12
ARTISAN_COMMISSION_RATE=15

# ----------------------------------
# Maps Configuration
# ----------------------------------
# Provider: google-maps or mapbox
MAPS_PROVIDER=google-maps

GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsXXXXXXXXXXXXXXXXX

# ----------------------------------
# AI Configuration
# ----------------------------------
# Provider: openai
AI_PROVIDER=openai

OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=1000

# AI Features
AI_RECOMMENDATIONS_ENABLED=false
AI_CHATBOT_ENABLED=false
AI_ARTISAN_MATCHING_ENABLED=true

# ----------------------------------
# WebSocket Configuration
# ----------------------------------
WEBSOCKET_ENABLED=true
WEBSOCKET_PORT=3000
WEBSOCKET_PATH=/socket.io
SOCKET_ADAPTER=memory # memory or redis

# ----------------------------------
# Monitoring & Logging
# ----------------------------------
LOG_LEVEL=info # error, warn, info, http, verbose, debug
LOG_FORMAT=json # json or simple

# Sentry (Error Tracking)
SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxx@sentry.io/1234567
SENTRY_ENVIRONMENT=development
SENTRY_ENABLED=false

# ----------------------------------
# Feature Flags
# ----------------------------------
FEATURE_ARTISAN_MARKETPLACE=true
FEATURE_PROPERTY_MANAGEMENT=true
FEATURE_SHORT_LET=true
FEATURE_AI_RECOMMENDATIONS=false

# ----------------------------------
# Admin Configuration
# ----------------------------------
# Initial super admin credentials (first setup only)
SUPER_ADMIN_EMAIL=admin@julaazng.com
SUPER_ADMIN_PASSWORD=ChangeThisSecurePassword123!
SUPER_ADMIN_FIRST_NAME=Super
SUPER_ADMIN_LAST_NAME=Admin

# ----------------------------------
# Nigerian Configuration
# ----------------------------------
DEFAULT_COUNTRY=Nigeria
DEFAULT_TIMEZONE=Africa/Lagos
DEFAULT_CURRENCY=NGN
PHONE_PREFIX=+234

# ----------------------------------
# Development Tools
# ----------------------------------
SWAGGER_ENABLED=true
SWAGGER_PATH=api/docs
DEBUG=false
TEST_MODE=false
```

## Quick Setup

1. Create `.env` file in the backend directory:
```bash
cd backend
touch .env
```

2. Copy the environment variables above into `.env`

3. Set up PostgreSQL and Redis (using Docker):
```bash
docker-compose up -d postgres redis
```

4. Replace placeholder values with actual credentials

5. Run database migrations:
```bash
npm run prisma:migrate
npm run prisma:seed
```

6. Start the development server:
```bash
npm run start:dev
```

## Environment-Specific Files

- **`.env`** - Local development (not committed)
- **`.env.production`** - Production (not committed)
- **`.env.example`** - Template (committed)
- **`.env.test`** - Testing environment (not committed)

## Security Notes

⚠️ **CRITICAL SECURITY REQUIREMENTS:**

1. **Never commit** `.env` files to Git
2. Use **strong, random secrets** for JWT keys (minimum 32 characters)
3. Use **different credentials** for development and production
4. **Rotate keys** immediately if exposed
5. Store production secrets in **secure vault** (AWS Secrets Manager, HashiCorp Vault)
6. Enable **HTTPS** in production (`JWT_COOKIE_SECURE=true`)
7. Use **environment-specific** database credentials

### Generating Secure Keys

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Required vs Optional Variables

### Required (Minimum to run):
- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL`

### Recommended for MVP:
- `REDIS_URL` (for caching and sessions)
- Payment gateway keys (Paystack or Flutterwave)
- Email service (SendGrid or Resend)
- SMS service (Termii)
- File storage (Cloudinary)

### Optional (Can be added later):
- AI services (OpenAI)
- Advanced monitoring (Sentry)
- Search engine (Typesense)
- WhatsApp Business API

## Database Setup

### Using Docker Compose

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Stop services
docker-compose down

# View logs
docker-compose logs -f postgres
```

### Manual Setup

**PostgreSQL:**
```bash
# Create database
createdb julaazng_dev

# Create user
psql -c "CREATE USER julaazng WITH PASSWORD 'password123';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE julaazng_dev TO julaazng;"
```

**Redis:**
```bash
# Install Redis
brew install redis  # macOS
apt install redis-server  # Ubuntu

# Start Redis
redis-server
```

## Testing Environment

Create `.env.test` for test environment:

```bash
# Test Database
TEST_DATABASE_URL=postgresql://julaazng:password123@localhost:5432/julaazng_test

# Mock external services
TEST_MODE=true
MOCK_PAYMENT_GATEWAY=true
MOCK_SMS_PROVIDER=true
MOCK_EMAIL_PROVIDER=true
```

## Production Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets
- [ ] Enable HTTPS (`JWT_COOKIE_SECURE=true`)
- [ ] Set `NODE_ENV=production`
- [ ] Use production database credentials
- [ ] Enable error tracking (Sentry)
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Set appropriate CORS origins
- [ ] Enable rate limiting
- [ ] Use production API keys for all services
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Enable logging to external service
- [ ] Set up health check monitoring

## Environment Variables by Service

### Payment Processing
```bash
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxx
PAYSTACK_MODE=live
```

### Email Service
```bash
SENDGRID_API_KEY=SG.live_key_here
SENDGRID_FROM_EMAIL=noreply@julaazng.com
```

### SMS Service
```bash
TERMII_API_KEY=TL_live_key_here
TERMII_SENDER_ID=JulaazNG
```

### File Storage
```bash
# Production: Use AWS S3
STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=AKIA_production_key
AWS_SECRET_ACCESS_KEY=production_secret
AWS_S3_BUCKET=julaazng-production
```

## Troubleshooting

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql postgresql://julaazng:password123@localhost:5432/julaazng_dev

# View Prisma connection logs
DEBUG=prisma* npm run start:dev
```

### Redis Connection Issues
```bash
# Test Redis connection
redis-cli ping

# Check Redis logs
redis-cli monitor
```

### JWT Issues
```bash
# Verify JWT secret length (minimum 32 characters)
echo -n "your-jwt-secret" | wc -c
```

