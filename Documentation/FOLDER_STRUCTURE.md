# 📁 JulaazNG Complete Folder Structure

**Status:** ✅ **COMPLETE AND READY**  
**Date:** January 2026  
**Mobile-First Approach:** ✅ Configured

This document provides a comprehensive overview of the entire project structure for both frontend and backend, including architecture patterns, folder trees, and development guidelines.

## 🎯 Architecture Overview

```
JulaazNG/
├── frontend/               # React 18 + TypeScript + Vite
├── backend/                # NestJS + TypeScript + Prisma
├── Documentation/          # Project documentation
├── logo.svg
├── icon.svg
└── README.md
```

---

## 🎨 Frontend Structure

**Architecture Pattern:** Feature-Sliced Design (FSD)  
**Tech Stack:** React 18, TypeScript, Vite, Zustand, TanStack Query, Tailwind CSS, shadcn/ui

### Complete Frontend Tree

```
frontend/
├── public/                                 # Static assets served directly
│   ├── icons/                              # PWA icons (various sizes)
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   ├── locales/                            # i18n translation files
│   │   ├── en-NG/
│   │   │   ├── common.json
│   │   │   ├── auth.json
│   │   │   ├── properties.json
│   │   │   ├── services.json
│   │   │   └── errors.json
│   │   ├── yo/                             # Yoruba translations
│   │   ├── ha/                             # Hausa translations
│   │   └── ig/                             # Igbo translations
│   ├── manifest.json                       # PWA manifest
│   ├── robots.txt                          # SEO robots file
│   └── favicon.ico                         # Browser favicon
│
├── src/
│   ├── app/                                # 🔴 Application Layer
│   │   ├── providers/                      # React context providers
│   │   │   ├── index.tsx                   # Provider composition (root)
│   │   │   ├── theme-provider.tsx          # Theme context & state
│   │   │   ├── auth-provider.tsx           # Authentication context
│   │   │   ├── query-provider.tsx          # TanStack Query setup
│   │   │   ├── i18n-provider.tsx           # Internationalization setup
│   │   │   └── toast-provider.tsx          # Toast notifications setup
│   │   │
│   │   ├── router/                         # Routing configuration
│   │   │   ├── index.tsx                   # Router setup & configuration
│   │   │   ├── routes.tsx                  # Route definitions
│   │   │   ├── protected-route.tsx         # Auth guard component
│   │   │   ├── role-based-route.tsx        # Role-specific guard
│   │   │   ├── lazy-routes.tsx             # Lazy-loaded route components
│   │   │   └── route-paths.ts              # Route path constants
│   │   │
│   │   ├── store/                          # Global Zustand stores
│   │   │   ├── auth.store.ts               # Auth state (user, tokens)
│   │   │   ├── theme.store.ts              # Theme state & preferences
│   │   │   ├── notification.store.ts       # Notification state
│   │   │   ├── ui.store.ts                 # UI state (modals, drawers)
│   │   │   ├── search.store.ts             # Search filters state
│   │   │   └── index.ts                    # Store barrel export
│   │   │
│   │   └── App.tsx                         # Root application component
│   │
│   ├── pages/                              # 🟢 Pages Layer (Route entry points)
│   │   ├── auth/                           # Authentication pages
│   │   │   ├── login/
│   │   │   │   ├── index.tsx               # Login page component
│   │   │   │   └── styles.ts               # Page-specific styles
│   │   │   ├── signup/
│   │   │   │   ├── index.tsx               # Multi-step signup
│   │   │   │   └── steps/                  # Signup wizard steps
│   │   │   │       ├── personal-info.tsx
│   │   │   │       ├── user-type.tsx
│   │   │   │       └── verification.tsx
│   │   │   ├── verify-otp/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   │
│   │   ├── properties/                     # Property pages
│   │   │   ├── search/
│   │   │   │   ├── index.tsx               # Property search & listing
│   │   │   │   └── components/             # Page-specific components
│   │   │   │       ├── filter-sidebar.tsx
│   │   │   │       ├── property-grid.tsx
│   │   │   │       └── map-view.tsx
│   │   │   ├── details/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── index.tsx           # Property detail view
│   │   │   │   │   └── sections/
│   │   │   │   │       ├── gallery.tsx
│   │   │   │   │       ├── info.tsx
│   │   │   │   │       ├── amenities.tsx
│   │   │   │   │       ├── location.tsx
│   │   │   │   │       └── reviews.tsx
│   │   │   ├── booking/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── index.tsx           # Booking flow
│   │   │   │   │   └── steps/
│   │   │   │   │       ├── viewing.tsx
│   │   │   │   │       ├── application.tsx
│   │   │   │   │       ├── documents.tsx
│   │   │   │   │       └── payment.tsx
│   │   │   └── my-bookings/
│   │   │       ├── index.tsx
│   │   │       └── components/
│   │   │           ├── booking-list.tsx
│   │   │           └── booking-detail.tsx
│   │   │
│   │   ├── services/                       # Service marketplace pages
│   │   │   ├── browse/
│   │   │   │   ├── index.tsx               # Service categories
│   │   │   │   └── components/
│   │   │   │       ├── category-grid.tsx
│   │   │   │       └── featured-services.tsx
│   │   │   ├── providers/
│   │   │   │   └── [id]/
│   │   │   │       ├── index.tsx           # Provider profile
│   │   │   │       └── sections/
│   │   │   └── bookings/
│   │   │       ├── index.tsx
│   │   │       ├── new/
│   │   │       └── history/
│   │   │
│   │   ├── artisans/                       # Artisan marketplace pages
│   │   │   ├── browse/
│   │   │   │   ├── index.tsx               # Browse artisans by category
│   │   │   │   └── components/
│   │   │   │       ├── category-tabs.tsx
│   │   │   │       └── artisan-list.tsx
│   │   │   ├── request-service/
│   │   │   │   ├── index.tsx               # Problem description form
│   │   │   │   └── steps/
│   │   │   │       ├── problem-description.tsx
│   │   │   │       ├── photo-upload.tsx
│   │   │   │       └── service-details.tsx
│   │   │   ├── matching/
│   │   │   │   ├── [requestId]/
│   │   │   │   │   ├── index.tsx           # Matched artisans display
│   │   │   │   │   └── components/
│   │   │   │   │       ├── artisan-card.tsx
│   │   │   │   │       └── proximity-map.tsx
│   │   │   ├── diagnostic/
│   │   │   │   └── [bookingId]/
│   │   │   │       ├── index.tsx           # Diagnostic payment & schedule
│   │   │   │       └── components/
│   │   │   └── bookings/
│   │   │       ├── index.tsx
│   │   │       ├── [id]/                   # Booking details & tracking
│   │   │       └── components/
│   │   │           ├── work-progress.tsx
│   │   │           └── photo-comparison.tsx
│   │   │
│   │   ├── property-management/            # Property management pages
│   │   │   ├── dashboard/
│   │   │   │   ├── index.tsx               # Management overview
│   │   │   │   └── widgets/
│   │   │   │       ├── revenue-chart.tsx
│   │   │   │       ├── occupancy-stats.tsx
│   │   │   │       └── recent-activity.tsx
│   │   │   ├── rent-collection/
│   │   │   │   ├── index.tsx               # Rent tracking & reminders
│   │   │   │   └── components/
│   │   │   ├── security-monitoring/
│   │   │   │   ├── index.tsx               # Camera feeds (premium)
│   │   │   │   └── components/
│   │   │   │       ├── camera-grid.tsx
│   │   │   │       ├── incident-alerts.tsx
│   │   │   │       └── playback-viewer.tsx
│   │   │   ├── maintenance/
│   │   │   │   ├── index.tsx               # Maintenance scheduling
│   │   │   │   └── components/
│   │   │   └── tenants/
│   │   │       ├── index.tsx               # Tenant management
│   │   │       └── components/
│   │   │
│   │   ├── dashboard/                      # User-specific dashboards
│   │   │   ├── tenant/
│   │   │   │   ├── index.tsx
│   │   │   │   └── sections/
│   │   │   │       ├── my-properties.tsx
│   │   │   │       ├── payment-history.tsx
│   │   │   │       └── maintenance-requests.tsx
│   │   │   ├── landlord/
│   │   │   │   ├── index.tsx
│   │   │   │   └── sections/
│   │   │   │       ├── properties.tsx
│   │   │   │       ├── bookings.tsx
│   │   │   │       └── earnings.tsx
│   │   │   ├── service-provider/
│   │   │   │   ├── index.tsx
│   │   │   │   └── sections/
│   │   │   ├── artisan/
│   │   │   │   ├── index.tsx
│   │   │   │   └── sections/
│   │   │   │       ├── active-jobs.tsx
│   │   │   │       ├── earnings.tsx
│   │   │   │       ├── skill-portfolio.tsx
│   │   │   │       └── ratings.tsx
│   │   │   └── property-manager/
│   │   │       ├── index.tsx
│   │   │       └── sections/
│   │   │
│   │   ├── admin/                          # Admin panel pages
│   │   │   ├── overview/
│   │   │   │   ├── index.tsx               # Admin dashboard
│   │   │   │   └── widgets/
│   │   │   ├── users/
│   │   │   │   ├── index.tsx               # User management
│   │   │   │   └── components/
│   │   │   ├── properties/
│   │   │   │   ├── index.tsx               # Property moderation
│   │   │   │   └── components/
│   │   │   ├── services/
│   │   │   ├── artisans/
│   │   │   │   ├── index.tsx               # Artisan verification
│   │   │   │   └── components/
│   │   │   ├── payments/
│   │   │   ├── analytics/
│   │   │   │   ├── index.tsx               # Business analytics
│   │   │   │   └── charts/
│   │   │   └── disputes/
│   │   │       ├── index.tsx
│   │   │       └── components/
│   │   │
│   │   ├── messaging/                      # Messaging pages
│   │   │   ├── conversations/
│   │   │   │   ├── index.tsx
│   │   │   │   └── components/
│   │   │   └── chat/
│   │   │       └── [conversationId]/
│   │   │           ├── index.tsx
│   │   │           └── components/
│   │   │
│   │   ├── notifications/
│   │   │   ├── index.tsx                   # Notification center
│   │   │   └── components/
│   │   │
│   │   ├── profile/                        # User profile pages
│   │   │   ├── view/
│   │   │   ├── edit/
│   │   │   ├── verification/
│   │   │   └── settings/
│   │   │
│   │   ├── home/
│   │   │   ├── index.tsx                   # Landing/home page
│   │   │   └── sections/
│   │   │       ├── hero.tsx
│   │   │       ├── featured-properties.tsx
│   │   │       ├── how-it-works.tsx
│   │   │       └── testimonials.tsx
│   │   │
│   │   └── not-found/
│   │       └── index.tsx                   # 404 page
│   │
│   ├── features/                           # 🔵 Features Layer (Business logic)
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   ├── auth.api.ts             # Auth API calls
│   │   │   │   └── endpoints.ts
│   │   │   ├── hooks/
│   │   │   │   ├── use-login.ts
│   │   │   │   ├── use-register.ts
│   │   │   │   ├── use-logout.ts
│   │   │   │   ├── use-verify-otp.ts
│   │   │   │   └── use-reset-password.ts
│   │   │   ├── components/
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── signup-form.tsx
│   │   │   │   ├── otp-input.tsx
│   │   │   │   └── social-login.tsx
│   │   │   ├── types.ts
│   │   │   ├── schemas.ts                  # Zod validation schemas
│   │   │   └── utils.ts
│   │   │
│   │   ├── properties/
│   │   │   ├── api/
│   │   │   │   ├── properties.api.ts
│   │   │   │   ├── bookings.api.ts
│   │   │   │   └── reviews.api.ts
│   │   │   ├── hooks/
│   │   │   │   ├── use-properties.ts
│   │   │   │   ├── use-property-detail.ts
│   │   │   │   ├── use-create-property.ts
│   │   │   │   ├── use-search-properties.ts
│   │   │   │   └── use-nearby-properties.ts
│   │   │   ├── components/
│   │   │   │   ├── property-form/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── basic-info.tsx
│   │   │   │   │   ├── location.tsx
│   │   │   │   │   ├── pricing.tsx
│   │   │   │   │   ├── amenities.tsx
│   │   │   │   │   └── media-upload.tsx
│   │   │   │   ├── property-filters/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── price-range.tsx
│   │   │   │   │   ├── location-filter.tsx
│   │   │   │   │   └── amenity-filter.tsx
│   │   │   │   ├── property-search/
│   │   │   │   └── property-map/
│   │   │   ├── types.ts
│   │   │   ├── schemas.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── services/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── service-card/
│   │   │   │   ├── service-booking-form/
│   │   │   │   ├── service-calendar/
│   │   │   │   └── provider-profile/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── artisans/
│   │   │   ├── api/
│   │   │   │   ├── artisans.api.ts
│   │   │   │   ├── bookings.api.ts
│   │   │   │   └── matching.api.ts
│   │   │   ├── hooks/
│   │   │   │   ├── use-artisan-search.ts
│   │   │   │   ├── use-request-service.ts
│   │   │   │   ├── use-artisan-matching.ts
│   │   │   │   ├── use-diagnostic-booking.ts
│   │   │   │   └── use-service-quote.ts
│   │   │   ├── components/
│   │   │   │   ├── problem-form/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── description.tsx
│   │   │   │   │   ├── photo-upload.tsx
│   │   │   │   │   └── urgency-select.tsx
│   │   │   │   ├── artisan-matching/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── artisan-card.tsx
│   │   │   │   │   └── proximity-indicator.tsx
│   │   │   │   ├── diagnostic-payment/
│   │   │   │   ├── service-quote/
│   │   │   │   └── work-progress/
│   │   │   │       ├── index.tsx
│   │   │   │       ├── timeline.tsx
│   │   │   │       └── before-after.tsx
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── property-management/
│   │   │   ├── api/
│   │   │   │   ├── management.api.ts
│   │   │   │   ├── rent-collection.api.ts
│   │   │   │   └── security.api.ts
│   │   │   ├── hooks/
│   │   │   │   ├── use-subscription.ts
│   │   │   │   ├── use-rent-collection.ts
│   │   │   │   ├── use-security-monitoring.ts
│   │   │   │   └── use-maintenance.ts
│   │   │   ├── components/
│   │   │   │   ├── rent-collection/
│   │   │   │   ├── security-dashboard/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── camera-grid.tsx
│   │   │   │   │   ├── live-feed.tsx
│   │   │   │   │   └── incident-log.tsx
│   │   │   │   ├── camera-feeds/
│   │   │   │   ├── maintenance-scheduler/
│   │   │   │   └── conflict-resolution/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── bookings/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── booking-form/
│   │   │   │   ├── viewing-scheduler/
│   │   │   │   ├── document-upload/
│   │   │   │   └── booking-timeline/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── api/
│   │   │   │   ├── payments.api.ts
│   │   │   │   ├── paystack.ts
│   │   │   │   └── flutterwave.ts
│   │   │   ├── hooks/
│   │   │   │   ├── use-payment.ts
│   │   │   │   ├── use-paystack.ts
│   │   │   │   └── use-flutterwave.ts
│   │   │   ├── components/
│   │   │   │   ├── payment-form/
│   │   │   │   ├── payment-methods/
│   │   │   │   ├── receipt/
│   │   │   │   └── transaction-history/
│   │   │   ├── integrations/
│   │   │   │   ├── paystack.ts
│   │   │   │   └── flutterwave.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── messaging/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   │   ├── use-conversations.ts
│   │   │   │   ├── use-messages.ts
│   │   │   │   ├── use-send-message.ts
│   │   │   │   └── use-socket.ts
│   │   │   ├── components/
│   │   │   │   ├── chat-window/
│   │   │   │   ├── message-list/
│   │   │   │   ├── message-input/
│   │   │   │   ├── conversation-list/
│   │   │   │   └── typing-indicator/
│   │   │   ├── socket/
│   │   │   │   ├── socket-client.ts
│   │   │   │   └── socket-events.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── notification-center/
│   │   │   │   ├── notification-item/
│   │   │   │   └── notification-preferences/
│   │   │   ├── fcm/
│   │   │   │   ├── fcm-client.ts
│   │   │   │   └── service-worker.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── verification/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── document-upload/
│   │   │   │   ├── identity-verification/
│   │   │   │   └── verification-status/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── reviews/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── review-form/
│   │   │   │   ├── review-list/
│   │   │   │   ├── rating-display/
│   │   │   │   └── review-stats/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   │
│   │   └── admin/
│   │       ├── api/
│   │       ├── hooks/
│   │       ├── components/
│   │       │   ├── user-management/
│   │       │   ├── content-moderation/
│   │       │   ├── analytics-dashboard/
│   │       │   └── dispute-resolution/
│   │       ├── types.ts
│   │       └── utils.ts
│   │
│   ├── entities/                           # 🟡 Entities Layer (Data models)
│   │   ├── user/
│   │   │   ├── model/
│   │   │   │   ├── types.ts                # User types & interfaces
│   │   │   │   ├── schemas.ts              # Zod validation schemas
│   │   │   │   └── constants.ts            # User-related constants
│   │   │   ├── api/
│   │   │   │   └── user.api.ts             # User API queries
│   │   │   └── lib/
│   │   │       └── user.utils.ts           # User utilities
│   │   │
│   │   ├── property/
│   │   │   ├── model/
│   │   │   │   ├── types.ts
│   │   │   │   ├── schemas.ts
│   │   │   │   └── constants.ts
│   │   │   ├── api/
│   │   │   └── lib/
│   │   │
│   │   ├── service/
│   │   │   ├── model/
│   │   │   ├── api/
│   │   │   └── lib/
│   │   │
│   │   ├── artisan/
│   │   │   ├── model/
│   │   │   │   ├── types.ts
│   │   │   │   ├── schemas.ts
│   │   │   │   └── constants.ts
│   │   │   ├── api/
│   │   │   └── lib/
│   │   │
│   │   ├── property-management/
│   │   │   ├── model/
│   │   │   ├── api/
│   │   │   └── lib/
│   │   │
│   │   ├── booking/
│   │   │   ├── model/
│   │   │   ├── api/
│   │   │   └── lib/
│   │   │
│   │   ├── payment/
│   │   │   ├── model/
│   │   │   ├── api/
│   │   │   └── lib/
│   │   │
│   │   └── notification/
│   │       ├── model/
│   │       ├── api/
│   │       └── lib/
│   │
│   ├── widgets/                            # 🟣 Widgets Layer (Complex UI)
│   │   ├── header/
│   │   │   ├── ui/
│   │   │   │   ├── desktop-header.tsx
│   │   │   │   ├── mobile-header.tsx
│   │   │   │   └── header-nav.tsx
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   ├── footer/
│   │   │   ├── ui/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   ├── sidebar/
│   │   │   ├── ui/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   ├── property-card/
│   │   │   ├── ui/
│   │   │   │   ├── property-card.tsx
│   │   │   │   ├── property-image.tsx
│   │   │   │   ├── property-info.tsx
│   │   │   │   └── property-actions.tsx
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   ├── service-card/
│   │   │   ├── ui/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   ├── artisan-card/
│   │   │   ├── ui/
│   │   │   │   ├── artisan-card.tsx
│   │   │   │   ├── profile-info.tsx
│   │   │   │   ├── rating-display.tsx
│   │   │   │   └── proximity-badge.tsx
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   ├── property-management-widget/
│   │   │   ├── ui/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   ├── booking-widget/
│   │   │   ├── ui/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   ├── chat-widget/
│   │   │   ├── ui/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   ├── theme-selector/
│   │   │   ├── ui/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   ├── notification-bell/
│   │   │   ├── ui/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   ├── search-bar/
│   │   │   ├── ui/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   └── user-menu/
│   │       ├── ui/
│   │       ├── index.tsx
│   │       └── styles.ts
│   │
│   ├── shared/                             # ⚪ Shared Layer (Reusable)
│   │   ├── ui/                             # shadcn/ui components
│   │   │   ├── button/
│   │   │   │   ├── button.tsx
│   │   │   │   └── index.ts
│   │   │   ├── input/
│   │   │   ├── card/
│   │   │   ├── dialog/
│   │   │   ├── dropdown-menu/
│   │   │   ├── form/
│   │   │   ├── select/
│   │   │   ├── tabs/
│   │   │   ├── toast/
│   │   │   ├── tooltip/
│   │   │   ├── avatar/
│   │   │   ├── badge/
│   │   │   ├── checkbox/
│   │   │   ├── radio-group/
│   │   │   ├── switch/
│   │   │   ├── slider/
│   │   │   ├── progress/
│   │   │   ├── skeleton/
│   │   │   ├── alert/
│   │   │   ├── alert-dialog/
│   │   │   ├── sheet/
│   │   │   ├── popover/
│   │   │   ├── command/
│   │   │   ├── calendar/
│   │   │   └── ... (other shadcn components)
│   │   │
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts            # Axios instance
│   │   │   │   ├── interceptors.ts      # Request/response interceptors
│   │   │   │   └── endpoints.ts         # API endpoint constants
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── cn.ts                # Class name utility (clsx)
│   │   │   │   ├── format.ts            # Formatting utilities
│   │   │   │   ├── validation.ts        # Validation helpers
│   │   │   │   ├── currency.ts          # Nigerian currency formatting
│   │   │   │   └── string.ts            # String utilities
│   │   │   │
│   │   │   ├── date/
│   │   │   │   ├── format.ts            # Date formatting
│   │   │   │   └── timezone.ts          # Timezone handling
│   │   │   │
│   │   │   ├── storage/
│   │   │   │   ├── local-storage.ts
│   │   │   │   └── session-storage.ts
│   │   │   │
│   │   │   └── error/
│   │   │       ├── error-handler.ts
│   │   │       └── error-messages.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   ├── use-theme.ts
│   │   │   ├── use-media-query.ts
│   │   │   ├── use-debounce.ts
│   │   │   ├── use-throttle.ts
│   │   │   ├── use-local-storage.ts
│   │   │   ├── use-disclosure.ts
│   │   │   ├── use-clipboard.ts
│   │   │   ├── use-geolocation.ts
│   │   │   └── use-online-status.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── routes.ts                # Route paths
│   │   │   ├── api-endpoints.ts         # API endpoints
│   │   │   ├── themes.ts                # Theme definitions
│   │   │   ├── nigerian-states.ts       # Nigerian states & LGAs
│   │   │   ├── service-categories.ts    # Service types
│   │   │   ├── artisan-categories.ts    # Artisan specializations
│   │   │   └── property-types.ts        # Property categories
│   │   │
│   │   ├── types/
│   │   │   ├── api.types.ts
│   │   │   ├── common.types.ts
│   │   │   ├── pagination.types.ts
│   │   │   └── window.d.ts
│   │   │
│   │   └── config/
│   │       ├── env.ts                   # Environment variables
│   │       ├── api.config.ts            # API configuration
│   │       └── app.config.ts            # App settings
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   ├── icon.svg
│   │   │   └── placeholders/
│   │   │       ├── property-placeholder.jpg
│   │   │       ├── user-avatar.png
│   │   │       └── no-image.svg
│   │   │
│   │   ├── icons/                       # Custom SVG icons
│   │   │   ├── property.svg
│   │   │   ├── service.svg
│   │   │   └── artisan.svg
│   │   │
│   │   └── fonts/                       # Custom fonts (if any)
│   │       └── inter/
│   │
│   ├── styles/
│   │   ├── index.css                    # Main CSS file
│   │   ├── tailwind.css                 # Tailwind directives
│   │   ├── themes/                      # Theme CSS variables
│   │   │   ├── naija-fresh.css
│   │   │   ├── eko-luxe.css
│   │   │   ├── arewa-calm.css
│   │   │   ├── ulo-oma.css
│   │   │   ├── rainy-9ja.css
│   │   │   └── ajebo-blend.css
│   │   └── fonts.css
│   │
│   ├── main.tsx                         # Application entry point
│   └── vite-env.d.ts                    # Vite type declarations
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── .husky/
│   ├── pre-commit
│   └── commit-msg
│
├── config/
│   └── lighthouse/
│
├── ENV_TEMPLATE.md                      # Environment variables guide
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── commitlint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Backend Structure

**Architecture Pattern:** Domain-Driven Design (DDD) + Clean Architecture  
**Tech Stack:** NestJS, TypeScript, Prisma, PostgreSQL, Redis, Socket.IO

### Complete Backend Tree

```
backend/
├── prisma/
│   ├── migrations/                      # Database migrations
│   │   ├── 20250101000000_init/
│   │   ├── 20250102000000_add_artisans/
│   │   └── migration_lock.toml
│   │
│   ├── seeds/                           # Seed data scripts
│   │   ├── users.seed.ts
│   │   ├── properties.seed.ts
│   │   ├── services.seed.ts
│   │   └── index.ts
│   │
│   └── schema.prisma                    # Database schema definition
│
├── src/
│   ├── main.ts                          # Application entry point
│   ├── app.module.ts                    # Root application module
│   │
│   ├── config/                          # 🟦 Configuration Layer
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── jwt.config.ts
│   │   ├── cloudinary.config.ts
│   │   ├── payment.config.ts
│   │   ├── notification.config.ts
│   │   └── index.ts
│   │
│   ├── common/                          # 🟪 Shared Utilities Layer
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── api-response.decorator.ts
│   │   │
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   ├── throttle.guard.ts
│   │   │   └── permission.guard.ts
│   │   │
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── cache.interceptor.ts
│   │   │   └── timeout.interceptor.ts
│   │   │
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   ├── prisma-exception.filter.ts
│   │   │   └── all-exceptions.filter.ts
│   │   │
│   │   ├── pipes/
│   │   │   ├── validation.pipe.ts
│   │   │   ├── parse-int.pipe.ts
│   │   │   └── file-validation.pipe.ts
│   │   │
│   │   ├── middlewares/
│   │   │   ├── logger.middleware.ts
│   │   │   ├── cors.middleware.ts
│   │   │   └── helmet.middleware.ts
│   │   │
│   │   ├── types/
│   │   │   ├── express.d.ts
│   │   │   ├── pagination.types.ts
│   │   │   └── response.types.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── roles.constant.ts
│   │   │   ├── permissions.constant.ts
│   │   │   └── error-messages.constant.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── hash.util.ts
│   │   │   ├── date.util.ts
│   │   │   ├── currency.util.ts
│   │   │   ├── slug.util.ts
│   │   │   └── file.util.ts
│   │   │
│   │   └── interfaces/
│   │       ├── pagination.interface.ts
│   │       └── base-service.interface.ts
│   │
│   ├── infrastructure/                  # 🟧 Infrastructure Layer
│   │   ├── database/
│   │   │   ├── prisma.service.ts
│   │   │   └── database.module.ts
│   │   │
│   │   ├── cache/
│   │   │   ├── cache.service.ts
│   │   │   └── cache.module.ts
│   │   │
│   │   ├── queue/
│   │   │   ├── queue.service.ts
│   │   │   ├── processors/
│   │   │   │   ├── email.processor.ts
│   │   │   │   ├── notification.processor.ts
│   │   │   │   └── payment.processor.ts
│   │   │   └── queue.module.ts
│   │   │
│   │   ├── storage/
│   │   │   ├── storage.service.ts
│   │   │   ├── cloudinary.service.ts
│   │   │   ├── s3.service.ts
│   │   │   └── storage.module.ts
│   │   │
│   │   ├── email/
│   │   │   ├── email.service.ts
│   │   │   ├── templates/
│   │   │   │   ├── welcome.template.ts
│   │   │   │   ├── verification.template.ts
│   │   │   │   ├── booking-confirmation.template.ts
│   │   │   │   └── payment-receipt.template.ts
│   │   │   └── email.module.ts
│   │   │
│   │   ├── sms/
│   │   │   ├── sms.service.ts
│   │   │   ├── termii.service.ts
│   │   │   └── sms.module.ts
│   │   │
│   │   ├── push/
│   │   │   ├── push.service.ts
│   │   │   ├── fcm.service.ts
│   │   │   └── push.module.ts
│   │   │
│   │   ├── payment/
│   │   │   ├── payment.service.ts
│   │   │   ├── paystack/
│   │   │   │   ├── paystack.service.ts
│   │   │   │   └── paystack.types.ts
│   │   │   ├── flutterwave/
│   │   │   │   ├── flutterwave.service.ts
│   │   │   │   └── flutterwave.types.ts
│   │   │   └── payment.module.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── ai.service.ts
│   │   │   ├── openai.service.ts
│   │   │   ├── langchain.service.ts
│   │   │   └── ai.module.ts
│   │   │
│   │   ├── maps/
│   │   │   ├── maps.service.ts
│   │   │   ├── google-maps.service.ts
│   │   │   ├── mapbox.service.ts
│   │   │   └── maps.module.ts
│   │   │
│   │   └── search/
│   │       ├── search.service.ts
│   │       ├── typesense.service.ts
│   │       └── search.module.ts
│   │
│   ├── modules/                         # 🟩 Domain Modules Layer
│   │   ├── auth/
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
│   │   │       ├── auth.service.spec.ts
│   │   │       └── auth.controller.spec.ts
│   │   │
│   │   ├── users/
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
│   │   ├── properties/
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
│   │   ├── bookings/
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
│   │   ├── services/
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
│   │   ├── artisans/
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
│   │   ├── property-management/
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
│   │   ├── payments/
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
│   │   ├── messaging/
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
│   │   ├── notifications/
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
│   │   ├── verification/
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
│   │   ├── reviews/
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
│   │   ├── analytics/
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── analytics-query.dto.ts
│   │   │   │   └── analytics-response.dto.ts
│   │   │   └── tests/
│   │   │
│   │   └── admin/
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
│   └── health/
│       ├── health.module.ts
│       └── health.controller.ts
│
├── test/                                # E2E tests
│   ├── app.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   ├── properties.e2e-spec.ts
│   ├── artisans.e2e-spec.ts
│   └── jest-e2e.json
│
├── docs/                                # Documentation
│   ├── api/
│   │   └── swagger.json
│   ├── architecture/
│   │   ├── overview.md
│   │   └── database-schema.md
│   └── deployment/
│       ├── docker.md
│       └── production.md
│
├── scripts/                             # Utility scripts
│   ├── seed.ts
│   ├── migrate.ts
│   └── generate-keys.ts
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── test.yml
│
├── .husky/
│   └── pre-commit
│
├── docker-compose.yml                   # Docker services setup
├── Dockerfile                           # Docker container config
├── ENV_TEMPLATE.md                      # Environment variables guide
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```

---

## 📊 Architecture Comparison

### Frontend: Feature-Sliced Design (FSD)

| Layer | Purpose | Examples |
|-------|---------|----------|
| **app/** | Application initialization | Providers, Router, Global stores |
| **pages/** | Route entry points | Login page, Property search, Dashboard |
| **features/** | Business logic | Auth hooks, Property filters, Booking flow |
| **entities/** | Data models | User types, Property schemas, API queries |
| **widgets/** | Complex UI | Header, Property card, Chat widget |
| **shared/** | Reusables | UI components, Utilities, Hooks |

### Backend: Domain-Driven Design (DDD)

| Layer | Purpose | Examples |
|-------|---------|----------|
| **config/** | Configuration | Database, JWT, Payment gateway config |
| **common/** | Shared utilities | Guards, Decorators, Pipes, Filters |
| **infrastructure/** | External services | Database, Cache, Email, Payment, AI |
| **modules/** | Domain logic | Auth, Properties, Artisans, Bookings |
| **health/** | System health | Health check endpoints |

---

## 🔑 Key Principles

### Frontend Principles
1. **Separation of Concerns** - Each layer has a specific responsibility
2. **Dependency Rule** - Inner layers don't depend on outer layers
3. **Reusability** - Shared components and utilities are truly reusable
4. **Scalability** - Easy to add new features without restructuring
5. **Testability** - Clear boundaries make testing easier

### Backend Principles
1. **Domain-First** - Business logic is central and independent
2. **Infrastructure Independence** - Easy to swap external services
3. **Clean Architecture** - Clear separation between layers
4. **Dependency Injection** - NestJS IoC container manages dependencies
5. **Modularity** - Each module is self-contained and reusable

---

## 📝 Naming Conventions

### Frontend

**Files:**
- Components: `kebab-case.tsx` (e.g., `property-card.tsx`)
- Hooks: `use-*.ts` (e.g., `use-properties.ts`)
- Types: `*.types.ts` (e.g., `property.types.ts`)
- Utils: `*.util.ts` or `*.ts` (e.g., `format.util.ts`)
- Stores: `*.store.ts` (e.g., `auth.store.ts`)

**Folders:**
- All folders: `kebab-case` (e.g., `property-management/`)

### Backend

**Files:**
- Controllers: `*.controller.ts` (e.g., `properties.controller.ts`)
- Services: `*.service.ts` (e.g., `properties.service.ts`)
- DTOs: `*.dto.ts` (e.g., `create-property.dto.ts`)
- Entities: `*.entity.ts` (e.g., `property.entity.ts`)
- Modules: `*.module.ts` (e.g., `properties.module.ts`)

**Folders:**
- All folders: `kebab-case` (e.g., `property-management/`)

---

## 🚀 Quick Navigation

### Common Development Locations

**Frontend:**
- Add new page: `src/pages/`
- Add business logic: `src/features/`
- Add UI component: `src/shared/ui/`
- Add reusable hook: `src/shared/hooks/`
- Add API types: `src/entities/*/model/`

**Backend:**
- Add new endpoint: `src/modules/*/`
- Add external service: `src/infrastructure/`
- Add middleware/guard: `src/common/`
- Add configuration: `src/config/`
- Database schema: `prisma/schema.prisma`

---

**This structure is designed to scale from MVP to enterprise-level application while remaining easy to understand and navigate.**

---

## ✅ Verification Checklist

Use this checklist to verify the project structure is complete:

### Frontend Structure
- [x] App layer (providers, router, stores)
- [x] Pages layer (route components)
- [x] Features layer (business logic)
- [x] Entities layer (data models)
- [x] Widgets layer (complex UI)
- [x] Shared layer (utilities)
- [x] Assets folder (images, icons)
- [x] Styles folder (themes, global styles)

### Backend Structure
- [x] Config layer (configuration)
- [x] Common layer (utilities)
- [x] Infrastructure layer (external services)
- [x] Modules layer (domain logic)
- [x] Health checks
- [x] Prisma schema

### Configuration
- [x] Frontend environment template
- [x] Backend environment template
- [x] Docker Compose configuration
- [x] TypeScript configurations
- [x] ESLint & Prettier configured

### Documentation
- [x] Main README created
- [x] Frontend README created
- [x] Backend README created
- [x] Folder structure documented
- [x] Getting started guide created

---

## 🎯 What You Can Do Now

### 1. Start Development
```bash
# Install and run everything
cd frontend && pnpm install && pnpm dev
# In another terminal
cd backend && npm install && docker-compose up -d && npm run start:dev
```

### 2. Build Features
- Use Feature-Sliced Design architecture for frontend
- Add new pages to `src/pages/`
- Add business logic to `src/features/`
- Add API endpoints to `backend/src/modules/`

### 3. Customize Themes
- Edit `frontend/src/styles/themes/` folder
- 6 Nigerian themes are ready to use
- Add more themes as needed

---

## 🎊 Summary

**Everything is set up and production-ready!**

- ✅ **50+ frontend folders** organized by FSD architecture
- ✅ **40+ backend folders** organized by DDD architecture
- ✅ **23 configuration files** for both FE and BE
- ✅ **Mobile-first** PWA configured
- ✅ **Documentation** organized and accessible
- ✅ **Development workflow** streamlined

**The structure is professional, scalable, and ready for development!** 🚀

---

**For setup instructions, see [GETTING_STARTED.md](GETTING_STARTED.md)**
