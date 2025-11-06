# Frontend Environment Variables Template

Copy this file's content to `.env.local` for development or `.env.production` for production.

**IMPORTANT:** Never commit `.env.local` or `.env.production` to version control!

```bash
# ==================================
# JulaazNG Frontend Environment Variables
# ==================================

# ----------------------------------
# Application Configuration
# ----------------------------------
VITE_APP_NAME=JulaazNG
VITE_APP_TITLE="JulaazNG - Nigeria's Property & Services Marketplace"
VITE_APP_DESCRIPTION="Find properties, book services, and connect with artisans across Nigeria"
VITE_APP_URL=http://localhost:5173
VITE_APP_ENV=development

# ----------------------------------
# API Configuration
# ----------------------------------
VITE_API_URL=http://localhost:3000/api
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000

# WebSocket/Socket.IO URL
VITE_SOCKET_URL=http://localhost:3000
VITE_SOCKET_PATH=/socket.io

# ----------------------------------
# Authentication
# ----------------------------------
VITE_AUTH_TOKEN_KEY=julaaz_auth_token
VITE_AUTH_REFRESH_TOKEN_KEY=julaaz_refresh_token
VITE_AUTH_USER_KEY=julaaz_user
VITE_SESSION_TIMEOUT=900000 # 15 minutes

# ----------------------------------
# Payment Integration
# ----------------------------------
# Paystack
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_PAYSTACK_MODE=test # test or live

# Flutterwave
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FLUTTERWAVE_MODE=test # test or live

# ----------------------------------
# File Upload & Storage
# ----------------------------------
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=julaazng_preset
VITE_CLOUDINARY_API_KEY=xxxxxxxxxxxxxxxxxxxx

# File size limits (in bytes)
VITE_MAX_IMAGE_SIZE=5242880 # 5MB
VITE_MAX_VIDEO_SIZE=52428800 # 50MB
VITE_MAX_DOCUMENT_SIZE=10485760 # 10MB

# ----------------------------------
# Maps & Geolocation
# ----------------------------------
VITE_GOOGLE_MAPS_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsXXXXXXXXXXXXXXXXX

# Default map center (Lagos, Nigeria)
VITE_DEFAULT_MAP_CENTER_LAT=6.5244
VITE_DEFAULT_MAP_CENTER_LNG=3.3792
VITE_DEFAULT_MAP_ZOOM=12

# ----------------------------------
# Firebase Cloud Messaging
# ----------------------------------
VITE_FCM_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FCM_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FCM_PROJECT_ID=your-project-id
VITE_FCM_STORAGE_BUCKET=your-project.appspot.com
VITE_FCM_MESSAGING_SENDER_ID=123456789012
VITE_FCM_APP_ID=1:123456789012:web:abcdefghijklmnop
VITE_FCM_VAPID_KEY=BPXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx

# ----------------------------------
# Analytics & Monitoring
# ----------------------------------
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_MIXPANEL_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxx@sentry.io/1234567
VITE_SENTRY_ENVIRONMENT=development

# ----------------------------------
# Feature Flags
# ----------------------------------
VITE_FEATURE_ARTISAN_MARKETPLACE=true
VITE_FEATURE_PROPERTY_MANAGEMENT=true
VITE_FEATURE_SHORT_LET=true
VITE_FEATURE_AI_RECOMMENDATIONS=false

# ----------------------------------
# Internationalization
# ----------------------------------
VITE_I18N_DEFAULT_LOCALE=en-NG
VITE_I18N_FALLBACK_LOCALE=en-NG
VITE_I18N_AVAILABLE_LOCALES=en-NG,yo,ha,ig

# ----------------------------------
# Theme Configuration
# ----------------------------------
VITE_DEFAULT_THEME=naija-fresh
VITE_AVAILABLE_THEMES=naija-fresh,eko-luxe,arewa-calm,ulo-oma,rainy-9ja,ajebo-blend

# ----------------------------------
# Nigerian Market Configuration
# ----------------------------------
VITE_DEFAULT_CURRENCY=NGN
VITE_CURRENCY_SYMBOL=₦
VITE_PHONE_PREFIX=+234
VITE_DEFAULT_STATE=Lagos
VITE_DEFAULT_CITY=Lagos Island

# ----------------------------------
# Additional Configuration
# ----------------------------------
VITE_DEBUG=false
VITE_MOCK_API=false
VITE_APP_VERSION=1.0.0
```

## Quick Setup

1. Create `.env.local` file in the frontend directory:
```bash
cd frontend
touch .env.local
```

2. Copy the environment variables above into `.env.local`

3. Replace placeholder values with your actual credentials:
   - Payment keys (Paystack, Flutterwave)
   - Cloud storage (Cloudinary)
   - Maps API keys (Google Maps or Mapbox)
   - Firebase configuration
   - Analytics tokens (optional)

4. Start the development server:
```bash
pnpm dev
```

## Environment-Specific Files

- **`.env.local`** - Local development (not committed)
- **`.env.production`** - Production build (not committed)
- **`.env.example`** - Template for documentation (committed)

## Security Notes

⚠️ **NEVER commit sensitive environment variables to Git**

- Add `.env.local` and `.env.production` to `.gitignore`
- Use different keys for development and production
- Rotate keys if accidentally exposed
- Store production keys in secure vault (e.g., AWS Secrets Manager)

## Required vs Optional Variables

### Required (Minimum to run):
- `VITE_API_URL`
- `VITE_APP_URL`

### Recommended for MVP:
- Payment gateway keys (Paystack or Flutterwave)
- Cloudinary credentials
- Firebase FCM configuration

### Optional (Can be added later):
- Analytics tools
- Maps API keys (can use OpenStreetMap without API key)
- AI features
- Advanced monitoring

