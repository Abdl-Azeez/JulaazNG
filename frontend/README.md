# JulaazNG Frontend

## 🎯 Overview
Production-ready React 18 + TypeScript + Vite frontend for JulaazNG - Nigeria's comprehensive property rental and services marketplace platform.

## 🏗️ Architecture
This project uses **Feature-Sliced Design (FSD)** - a modern architectural methodology for frontend applications that provides:
- **Clear separation of concerns** between layers
- **Scalable folder structure** that grows with your application
- **Easy navigation** and discoverability
- **Reusability** and maintainability

### Architecture Layers (from core to specific):
1. **`shared/`** - Reusable utilities, UI components, hooks (no business logic)
2. **`entities/`** - Business entities and API models
3. **`features/`** - Business logic and user interactions
4. **`widgets/`** - Complex UI compositions combining multiple features
5. **`pages/`** - Route components (entry points for each page)
6. **`app/`** - Application initialization, providers, global config

## 📦 Tech Stack

### Core Technologies
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** 
  - Zustand (global state)
  - TanStack Query v5 (server state)
- **Styling:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Real-time:** Socket.IO client
- **Internationalization:** i18next
- **PWA:** Vite PWA plugin
- **Push Notifications:** Firebase Cloud Messaging

### Development Tools
- **Type Checking:** TypeScript 5.5+
- **Linting:** ESLint 9
- **Formatting:** Prettier
- **Git Hooks:** Husky + lint-staged
- **Commit Convention:** Commitlint
- **Testing:** Vitest + React Testing Library
- **Performance:** Lighthouse CI

## 📁 Project Structure

```
frontend/
├── public/                          # Static assets
│   ├── icons/                       # PWA icons
│   ├── locales/                     # i18n translation files
│   └── manifest.json                # PWA manifest
│
├── src/
│   ├── app/                         # Application initialization layer
│   │   ├── providers/               # React context providers
│   │   │   ├── index.tsx            # Provider composition
│   │   │   ├── theme-provider.tsx   # Theme context
│   │   │   ├── auth-provider.tsx    # Authentication context
│   │   │   ├── query-provider.tsx   # TanStack Query setup
│   │   │   └── i18n-provider.tsx    # Internationalization
│   │   ├── router/                  # Routing configuration
│   │   │   ├── index.tsx            # Router setup
│   │   │   ├── routes.tsx           # Route definitions
│   │   │   ├── protected-route.tsx  # Auth guards
│   │   │   └── lazy-routes.tsx      # Lazy-loaded routes
│   │   ├── store/                   # Global Zustand stores
│   │   │   ├── auth.store.ts        # Auth state
│   │   │   ├── theme.store.ts       # Theme state
│   │   │   ├── notification.store.ts # Notifications
│   │   │   └── ui.store.ts          # UI state (modals, etc)
│   │   └── App.tsx                  # Root component
│   │
│   ├── pages/                       # Route entry points
│   │   ├── auth/                    # Authentication pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── verify-otp/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── properties/              # Property pages
│   │   │   ├── search/              # Property search & listing
│   │   │   ├── details/             # Property detail view
│   │   │   ├── booking/             # Booking flow
│   │   │   └── my-bookings/         # User bookings
│   │   ├── services/                # Service marketplace pages
│   │   │   ├── browse/              # Service categories
│   │   │   ├── providers/           # Service provider profiles
│   │   │   └── bookings/            # Service bookings
│   │   ├── artisans/                # Artisan marketplace pages
│   │   │   ├── browse/              # Artisan categories
│   │   │   ├── request-service/     # Problem description form
│   │   │   ├── matching/            # Artisan matching results
│   │   │   ├── diagnostic/          # Diagnostic booking
│   │   │   └── bookings/            # Artisan service bookings
│   │   ├── property-management/     # Property management pages
│   │   │   ├── dashboard/           # Management overview
│   │   │   ├── rent-collection/     # Rent tracking
│   │   │   ├── security-monitoring/ # Camera feeds (premium)
│   │   │   ├── maintenance/         # Maintenance scheduling
│   │   │   └── tenants/             # Tenant management
│   │   ├── dashboard/               # User dashboards
│   │   │   ├── tenant/              # Tenant dashboard
│   │   │   ├── landlord/            # Landlord dashboard
│   │   │   ├── service-provider/    # Service provider dashboard
│   │   │   ├── artisan/             # Artisan dashboard
│   │   │   └── property-manager/    # Property manager dashboard
│   │   ├── admin/                   # Admin panel pages
│   │   │   ├── overview/            # Admin overview
│   │   │   ├── users/               # User management
│   │   │   ├── properties/          # Property moderation
│   │   │   ├── services/            # Service management
│   │   │   ├── artisans/            # Artisan verification
│   │   │   ├── payments/            # Payment oversight
│   │   │   ├── analytics/           # Business analytics
│   │   │   └── disputes/            # Dispute resolution
│   │   ├── messaging/               # Messaging pages
│   │   │   ├── conversations/
│   │   │   └── chat/
│   │   ├── notifications/           # Notifications center
│   │   ├── profile/                 # User profile pages
│   │   │   ├── view/
│   │   │   ├── edit/
│   │   │   ├── verification/
│   │   │   └── settings/
│   │   ├── home/                    # Landing/home page
│   │   └── not-found/               # 404 page
│   │
│   ├── features/                    # Business logic modules
│   │   ├── auth/                    # Authentication feature
│   │   │   ├── api/                 # Auth API calls
│   │   │   ├── hooks/               # Auth-specific hooks
│   │   │   ├── components/          # Auth UI components
│   │   │   ├── types.ts             # Auth types
│   │   │   └── utils.ts             # Auth utilities
│   │   ├── properties/              # Property management
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── property-form/
│   │   │   │   ├── property-filters/
│   │   │   │   ├── property-search/
│   │   │   │   └── property-map/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── services/                # Service booking
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── service-card/
│   │   │   │   ├── service-booking-form/
│   │   │   │   └── service-calendar/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── artisans/                # Artisan network
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── problem-form/
│   │   │   │   ├── artisan-matching/
│   │   │   │   ├── diagnostic-payment/
│   │   │   │   ├── service-quote/
│   │   │   │   └── work-progress/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── property-management/     # Premium property management
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── rent-collection/
│   │   │   │   ├── security-dashboard/
│   │   │   │   ├── camera-feeds/
│   │   │   │   ├── maintenance-scheduler/
│   │   │   │   └── conflict-resolution/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── bookings/                # Booking system
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── booking-form/
│   │   │   │   ├── viewing-scheduler/
│   │   │   │   ├── document-upload/
│   │   │   │   └── booking-timeline/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── payments/                # Payment processing
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── payment-form/
│   │   │   │   ├── payment-methods/
│   │   │   │   └── receipt/
│   │   │   ├── integrations/
│   │   │   │   ├── paystack.ts
│   │   │   │   └── flutterwave.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── messaging/               # Real-time messaging
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── chat-window/
│   │   │   │   ├── message-list/
│   │   │   │   ├── message-input/
│   │   │   │   └── conversation-list/
│   │   │   ├── socket/              # Socket.IO setup
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── notifications/           # Notification system
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── notification-center/
│   │   │   │   ├── notification-item/
│   │   │   │   └── notification-preferences/
│   │   │   ├── fcm/                 # FCM integration
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── verification/            # User verification
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── document-upload/
│   │   │   │   ├── identity-verification/
│   │   │   │   └── verification-status/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── reviews/                 # Review & rating system
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   │   ├── review-form/
│   │   │   │   ├── review-list/
│   │   │   │   └── rating-display/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   └── admin/                   # Admin operations
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
│   ├── entities/                    # Business entities & API models
│   │   ├── user/
│   │   │   ├── model/               # User data models
│   │   │   │   ├── types.ts
│   │   │   │   ├── schemas.ts       # Zod schemas
│   │   │   │   └── constants.ts
│   │   │   ├── api/                 # User API queries
│   │   │   └── lib/                 # User utilities
│   │   ├── property/
│   │   │   ├── model/
│   │   │   │   ├── types.ts
│   │   │   │   ├── schemas.ts
│   │   │   │   └── constants.ts
│   │   │   ├── api/
│   │   │   └── lib/
│   │   ├── service/
│   │   │   ├── model/
│   │   │   ├── api/
│   │   │   └── lib/
│   │   ├── artisan/
│   │   │   ├── model/
│   │   │   ├── api/
│   │   │   └── lib/
│   │   ├── property-management/
│   │   │   ├── model/
│   │   │   ├── api/
│   │   │   └── lib/
│   │   ├── booking/
│   │   │   ├── model/
│   │   │   ├── api/
│   │   │   └── lib/
│   │   ├── payment/
│   │   │   ├── model/
│   │   │   ├── api/
│   │   │   └── lib/
│   │   └── notification/
│   │       ├── model/
│   │       ├── api/
│   │       └── lib/
│   │
│   ├── widgets/                     # Complex UI compositions
│   │   ├── header/                  # App header
│   │   │   ├── ui/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── footer/                  # App footer
│   │   ├── sidebar/                 # Navigation sidebar
│   │   ├── property-card/           # Property listing card
│   │   ├── service-card/            # Service card
│   │   ├── artisan-card/            # Artisan profile card
│   │   ├── property-management-widget/ # Management dashboard widget
│   │   ├── booking-widget/          # Booking summary widget
│   │   ├── chat-widget/             # Chat interface
│   │   ├── theme-selector/          # Theme switcher
│   │   ├── notification-bell/       # Notification icon with dropdown
│   │   ├── search-bar/              # Global search bar
│   │   └── user-menu/               # User dropdown menu
│   │
│   ├── shared/                      # Shared utilities & components
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── card/
│   │   │   ├── dialog/
│   │   │   ├── dropdown-menu/
│   │   │   ├── form/
│   │   │   ├── select/
│   │   │   ├── tabs/
│   │   │   ├── toast/
│   │   │   ├── tooltip/
│   │   │   └── ... (other shadcn components)
│   │   ├── lib/                     # Utility functions
│   │   │   ├── api/                 # API client setup
│   │   │   │   ├── client.ts        # Axios instance
│   │   │   │   ├── interceptors.ts
│   │   │   │   └── endpoints.ts
│   │   │   ├── utils/               # General utilities
│   │   │   │   ├── cn.ts            # Class name utility
│   │   │   │   ├── format.ts        # Formatting utilities
│   │   │   │   ├── validation.ts    # Validation helpers
│   │   │   │   └── currency.ts      # Nigerian currency formatting
│   │   │   ├── date/                # Date utilities
│   │   │   ├── storage/             # LocalStorage/SessionStorage
│   │   │   └── error/               # Error handling
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── use-auth.ts          # Auth hook
│   │   │   ├── use-theme.ts         # Theme hook
│   │   │   ├── use-media-query.ts   # Responsive hook
│   │   │   ├── use-debounce.ts
│   │   │   ├── use-local-storage.ts
│   │   │   └── use-disclosure.ts
│   │   ├── constants/               # App constants
│   │   │   ├── routes.ts            # Route paths
│   │   │   ├── api-endpoints.ts     # API endpoints
│   │   │   ├── themes.ts            # Theme definitions
│   │   │   ├── nigerian-states.ts   # Nigerian locations
│   │   │   └── service-categories.ts # Service types
│   │   ├── types/                   # Global TypeScript types
│   │   │   ├── api.types.ts
│   │   │   ├── common.types.ts
│   │   │   └── window.d.ts
│   │   └── config/                  # Configuration files
│   │       ├── env.ts               # Environment variables
│   │       ├── api.config.ts        # API configuration
│   │       └── app.config.ts        # App settings
│   │
│   ├── assets/                      # Static assets
│   │   ├── images/                  # Optimized images
│   │   │   ├── logo.svg
│   │   │   ├── icon.svg
│   │   │   └── placeholders/
│   │   ├── icons/                   # SVG icons
│   │   └── fonts/                   # Custom fonts
│   │
│   ├── styles/                      # Global styles
│   │   ├── index.css                # Main CSS file
│   │   ├── tailwind.css             # Tailwind directives
│   │   ├── themes/                  # Theme CSS variables
│   │   │   ├── naija-fresh.css
│   │   │   ├── eko-luxe.css
│   │   │   ├── arewa-calm.css
│   │   │   ├── ulo-oma.css
│   │   │   ├── rainy-9ja.css
│   │   │   └── ajebo-blend.css
│   │   └── fonts.css                # Font declarations
│   │
│   ├── main.tsx                     # Application entry point
│   └── vite-env.d.ts                # Vite type declarations
│
├── .github/                         # GitHub configuration
│   └── workflows/                   # CI/CD workflows
│       ├── ci.yml                   # Continuous Integration
│       └── deploy.yml               # Deployment
│
├── .husky/                          # Git hooks
│   ├── pre-commit                   # Lint staged files
│   └── commit-msg                   # Commit message linting
│
├── config/                          # Build configuration
│   └── lighthouse/                  # Lighthouse CI config
│
├── .env.example                     # Environment variables template
├── .eslintrc.cjs                    # ESLint configuration
├── .gitignore                       # Git ignore rules
├── .prettierrc                      # Prettier configuration
├── commitlint.config.js             # Commit message rules
├── index.html                       # HTML entry point
├── package.json                     # Dependencies & scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.node.json               # TypeScript for Node
├── vite.config.ts                   # Vite configuration
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- pnpm 9.x (recommended) or npm/yarn

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Run linting
pnpm lint

# Run type checking
pnpm type-check
```

## 🎨 Theming System

The application supports **6 Nigerian-themed color schemes**:

1. **Naija Fresh** (Default) - Green/Nature inspired
2. **Eko Luxe** - Lagos Premium, Dark Gold
3. **Arewa Calm** - Northern Nigeria, Earth Tones
4. **Ụlọ Oma** - Igbo Heritage, Red/Traditional
5. **Rainy 9ja** - Lagos Rainy Season, Blue/Cool
6. **Ajébo Blend** - Modern Nigerian, Purple/Tech

Each theme is defined using CSS variables and can be switched dynamically.

## 🌍 Internationalization

Supports 4 languages:
- **English (en-NG)** - Primary
- **Yoruba (yo)** - Secondary
- **Hausa (ha)** - Secondary
- **Igbo (ig)** - Secondary

Translation files are located in `/public/locales/`.

## 🔐 Authentication & Authorization

- JWT-based authentication with HTTP-only cookies
- Role-based access control (RBAC)
- Multi-factor authentication (MFA) support
- Protected routes and role-specific dashboards

### User Roles:
- **Tenant** - Search and book properties
- **Landlord** - List and manage properties
- **Service Provider** - Offer cleaning, moving services
- **Artisan** - Provide skilled trade services
- **Property Manager** - Manage properties for landlords
- **Admin** - Platform administration

## 📱 Progressive Web App (PWA)

The application is a fully-featured PWA with:
- Offline support
- Install prompt
- Push notifications (FCM)
- Background sync
- Caching strategies

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run end-to-end tests
pnpm test:e2e
```

## 📊 Performance Monitoring

- **Core Web Vitals** tracking
- **Lighthouse CI** integration
- **Bundle size analysis**
- **Performance budgets**

## 🛠️ Development Guidelines

### Code Style
- Use TypeScript for all files
- Follow ESLint and Prettier rules
- Use functional components with hooks
- Implement proper error boundaries
- Use absolute imports with `@/` prefix

### Component Structure
```tsx
import { FC } from 'react'
import { cn } from '@/shared/lib/utils/cn'

interface ComponentProps {
  // Props interface
}

export const Component: FC<ComponentProps> = ({ ...props }) => {
  // Component logic
  
  return (
    <div className={cn('base-styles', props.className)}>
      {/* Component JSX */}
    </div>
  )
}
```

### State Management
- **Local state**: `useState`, `useReducer`
- **Global state**: Zustand stores
- **Server state**: TanStack Query
- **Form state**: React Hook Form

### API Integration
```tsx
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api/client'

// In hooks/use-properties.ts
export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: () => apiClient.get('/properties')
  })
}

export const useCreateProperty = () => {
  return useMutation({
    mutationFn: (data) => apiClient.post('/properties', data)
  })
}
```

## 🔄 Git Workflow

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add property search filters
fix: resolve payment processing bug
docs: update API documentation
style: format code with prettier
refactor: restructure property components
test: add unit tests for auth
chore: update dependencies
```

## 🔐 Refined Login UX Flow (Modern, Session-Aware)

This app implements a session-aware, multi-role experience that removes role selection from the login screen and turns role management into a productivity feature.

### UX Principles
- **Contextual**: Roles feel like tools, not identities.
- **Intelligent**: System suggests rather than asks.
- **Seamless**: Maintains separate states for smooth transitions.
- **Discoverable**: Users learn about capabilities of other roles.
- **Secure**: Role isolation is preserved; awareness is allowed.
- **Smooth**: No second login page.
- **Fast**: Switch roles without full logout.
- **Consistent**: Clear visual context per role, no mixed dashboards.

### Flow
1. **Login → Token with roles**
   - User logs in once.
   - Backend returns JWT/session containing all roles.
2. **Auto-redirect or soft role selection**
   - If only one role → auto-redirect to that role’s landing.
   - If multiple roles → show a lightweight modal “Role Gateway” with role cards. Past behavior defaults to the last used role.
3. **Session context**
   - `activeRole` in a global store (Zustand) and persisted.
   - API requests include `X-Active-Role` header for backend awareness.
   - Layout, routes, and API adapt to `activeRole`.
4. **Role switching**
   - “Role” button in header opens the same modal.
   - Selecting a role reinitializes app shell concerns (sidebar/routes) and shows a toast.
5. **Persistent preferred role**
   - Last used role is tracked and becomes the default suggestion.

### Data model
```ts
type RoleType =
  | 'tenant'
  | 'landlord'
  | 'service_provider'
  | 'artisan'
  | 'property_manager'
  | 'admin'
  | 'handyman'
  | 'homerunner'

interface UserRole {
  type: RoleType
  priority?: 'primary' | 'secondary'
  lastUsed?: boolean
}
```

### Developer integration
- Global store:
  - `src/shared/store/role.store.ts` exposes `roles`, `activeRole`, `setRoles`, `setActiveRole`, and `openRoleSwitcher`.
- Role Gateway modal:
  - `src/widgets/role-gateway/RoleGateway.tsx` is mounted at app root (`src/app/App.tsx`).
  - Opens automatically if user has multiple roles and no `activeRole`, or on demand via header.
- Header role switch:
  - `src/widgets/header/Header.tsx` shows the current role and a “Role” button to switch.
- API client:
  - `src/shared/lib/api/client.ts` injects `Authorization` and `X-Active-Role` headers automatically.

### Routing guidance
- Map roles to landing routes in one place (see `RoleGateway` for examples).
- For role-specific pages, derive visibility and navigation from `activeRole`.

### Backend expectations
- Include all user roles in the authentication payload.
- Respect `X-Active-Role` on every request for authorization and scoping.

### Demo accounts

| Name | Roles | Email | Password | Phone |
| --- | --- | --- | --- | --- |
| Tosin Adeyemi | Tenant | `tenant@julaaz.com` | `tenant123` | `08010000001` |
| Femi Ogunleye | Landlord | `landlord@julaaz.com` | `landlord123` | `08010000002` |
| Chioma Nwosu | Tenant & Landlord | `hybrid@julaaz.com` | `hybrid123` | `08010000003` |


### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `chore/` - Maintenance tasks

## 📦 Build & Deployment

```bash
# Production build
pnpm build

# Analyze bundle size
pnpm build:analyze

# Check bundle size
pnpm size
```

### Environment Variables

```env
# API
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000

# Payment Gateways
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxx

# Firebase Cloud Messaging
VITE_FCM_API_KEY=xxxxx
VITE_FCM_AUTH_DOMAIN=xxxxx
VITE_FCM_PROJECT_ID=xxxxx

# File Upload
VITE_CLOUDINARY_CLOUD_NAME=xxxxx
VITE_CLOUDINARY_UPLOAD_PRESET=xxxxx

# Maps
VITE_MAPBOX_TOKEN=xxxxx
VITE_GOOGLE_MAPS_KEY=xxxxx

# App Configuration
VITE_APP_NAME=JulaazNG
VITE_APP_URL=https://julaazng.com
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Proprietary - All rights reserved

## 👥 Team

- **Developer:** Solo Developer with AI assistance
- **Design:** Based on PRD and UI/UX specifications
- **Architecture:** Feature-Sliced Design (FSD)

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@julaazng.com

---

**Built with ❤️ for the Nigerian property market**

