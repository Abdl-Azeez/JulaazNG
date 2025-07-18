**🎯 AI Prompt: JulaazNG Frontend Setup**

## **Context & Product Overview**

You are a **senior frontend architect** with expertise in React 18, TypeScript, Vite, and enterprise-level application architecture. You're tasked with scaffolding a **production-ready frontend** for **JulaazNG** - Nigeria's comprehensive property rental and services platform.

### **Platform Overview (From PRD):**
- **Core Business**: Property rentals (long-term + short-let/Airbnb-style) + services marketplace (cleaning, moving, labor)
- **Target Market**: Nigerian market starting with Lagos (15M+ residents, 60% renters)
- **User Types**: Tenants, Landlords, Service Providers, Platform Admins
- **Key Features**: Property search/booking, service marketplace, payment processing, real-time messaging, admin dashboard
- **Revenue Model**: Commission-based (5-8% rental, 10-15% services)

## **Technical Requirements**

### **1. Core Tech Stack (Mandatory)**
```typescript
// Required Stack from PRD Section 9.1
const techStack = {
  framework: "React 18 + TypeScript + Vite",
  stateManagement: {
    global: "Zustand",
    server: "TanStack Query v5"
  },
  styling: "Tailwind CSS + shadcn/ui + Lucide Icons",
  routing: "React Router v6",
  forms: "React Hook Form + Zod validation",
  animations: "Framer Motion",
  realtime: "Socket.IO client (chat/notifications)",
  i18n: "i18next (English + Yoruba/Hausa/Igbo)",
  pwa: "Vite PWA plugin",
  notifications: "Firebase Cloud Messaging (FCM)"
};
```

### **2. Enterprise Architecture Requirements**

Use **enterprise-level file structure and architecture**, with proper layering for:
>
>    * App shell layout
>    * Feature-based folder structure (e.g., `/features`, `/entities`, `/shared`, `/widgets`, `/pages`)
>    * Code splitting and lazy loading
>    * Environment and configuration management
>    * Theme engine (as defined in PRD)
>    * Dark/light mode support
>    * Reusable components and utilities
> 3. Integrate tooling and standards:
>
>    * ESLint, Prettier, Husky, and lint-staged
>    * Commitlint (conventional commits)
>    * Absolute imports via `tsconfig.paths`
>    * Responsive design, accessibility (WCAG 2.1 AA), and performance best practices (Core Web Vitals)

#### **File Structure (Feature-Sliced Design)**
```bash
src/
├── app/                          # App initialization & providers
│   ├── providers/                # React providers (Theme, Auth, Query)
│   ├── router/                   # React Router configuration
│   └── store/                    # Global Zustand stores
├── pages/                        # Route components (lazy-loaded)
│   ├── auth/                     # Login, Signup, Verification
│   ├── properties/               # Property search, details, booking
│   ├── services/                 # Service marketplace & booking
│   ├── dashboard/                # User-specific dashboards
│   └── admin/                    # Admin panel routes
├── features/                     # Business logic modules
│   ├── auth/                     # Authentication flows
│   ├── properties/               # Property management
│   ├── services/                 # Service booking
│   ├── messaging/                # Real-time chat
│   ├── payments/                 # Payment processing
│   └── admin/                    # Admin operations
├── entities/                     # Business entities & API models
│   ├── user/                     # User types & interfaces
│   ├── property/                 # Property schemas
│   ├── service/                  # Service types
│   └── booking/                  # Booking models
├── shared/                       # Reusable utilities
│   ├── ui/                       # shadcn/ui components
│   ├── lib/                      # Utilities & helpers
│   ├── hooks/                    # Custom React hooks
│   ├── constants/                # App constants & enums
│   ├── types/                    # Global TypeScript types
│   └── config/                   # Configuration files
├── widgets/                      # Complex UI components
│   ├── property-card/            # Property listing cards
│   ├── service-selector/         # Service category picker
│   ├── chat-widget/              # Real-time messaging
│   └── theme-selector/           # Theme switching component
└── assets/                       # Static files
    ├── images/                   # Optimized images
    ├── icons/                    # SVG icons
    └── fonts/                    # Custom fonts
```

#### **Theme System Implementation (PRD Section 7.3-7.4)**
```typescript
// Required: 6 Nigerian-themed color schemes
const themes = {
  "naija-fresh": {    // Default - Green/Nature
    background: "#f7f9f7",
    primary: "#00a754",
    // ... complete CSS variables
  },
  "eko-luxe": {       // Lagos Premium - Dark Gold
    background: "#0d1f23",
    primary: "#019863",
    // ... complete CSS variables
  },
  "arewa-calm": {     // Northern Nigeria - Earth Tones
    background: "#f8f4e5",
    primary: "#a77e00",
    // ... complete CSS variables
  },
  "ulo-oma": {        // Igbo Heritage - Red/Traditional
    background: "#fef9f4",
    primary: "#d42f2f",
    // ... complete CSS variables
  },
  "rainy-9ja": {      // Lagos Rainy Season - Blue/Cool
    background: "#0f172a",
    primary: "#0284c7",
    // ... complete CSS variables
  },
  "ajebo-blend": {    // Modern Nigerian - Purple/Tech
    background: "#111827",
    primary: "#9333ea",
    // ... complete CSS variables
  }
};

// Theme Context with system preference detection
interface ThemeContextType {
  theme: keyof typeof themes;
  setTheme: (theme: keyof typeof themes) => void;
  systemTheme: 'light' | 'dark';
}
```

### **3. Core Features to Scaffold**

#### **Authentication System (PRD Section 8.1)**
```typescript
// User roles from PRD
enum UserRole {
  TENANT = 'tenant',
  LANDLORD = 'landlord',
  SERVICE_PROVIDER = 'service_provider',
  ADMIN = 'admin'
}

// Multi-factor auth support
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  mfaEnabled: boolean;
}
```

#### **Property Search System (PRD Section 8.2)**
```typescript
// Advanced filtering from PRD
interface PropertySearchFilters {
  location: {
    state: string;
    lga: string;
    area: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  propertyType: 'apartment' | 'house' | 'studio' | 'duplex';
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  availability: 'immediate' | 'future';
  furnishing: 'furnished' | 'semi-furnished' | 'unfurnished';
}
```

#### **Service Marketplace (PRD Section 8.4)**
```typescript
// Service categories from PRD
enum ServiceCategory {
  CLEANING = 'cleaning',
  MOVING = 'moving',
  MAINTENANCE = 'maintenance',
  UTILITIES = 'utilities'
}

// Service booking flow
interface ServiceBooking {
  id: string;
  category: ServiceCategory;
  providerId: string;
  customerId: string;
  scheduledDate: Date;
  status: BookingStatus;
  pricing: {
    basePrice: number;
    materials?: number;
    total: number;
  };
}
```

### **4. Developer Experience & Tooling**
```json
// Required dev tools configuration
{
  "linting": "ESLint + TypeScript rules",
  "formatting": "Prettier with custom config",
  "commits": "Husky + lint-staged + Commitlint",
  "imports": "Absolute imports via @/ prefix",
  "testing": "Vitest + React Testing Library",
  "bundle": "Vite with code splitting & lazy loading",
  "pwa": "Service worker + offline fallbacks",
  "performance": "Lighthouse CI + Core Web Vitals"
}
```

### **5. Accessibility & Localization (PRD Section 6)**
```typescript
// WCAG 2.1 AA compliance
const a11yFeatures = {
  screenReader: "ARIA labels + semantic HTML",
  keyboard: "Full keyboard navigation",
  contrast: "4.5:1 minimum contrast ratio",
  responsive: "Mobile-first responsive design",
  focus: "Visible focus indicators"
};

// Multi-language support
const languages = {
  primary: "en-NG",    // Nigerian English
  secondary: ["yo", "ha", "ig"]  // Yoruba, Hausa, Igbo
};
```

## **Deliverables Required**

### **1. Project Structure**
- Complete folder structure as executable code
- Package.json with all dependencies
- Environment configuration (.env.example)

### **2. Core Configuration Files**
```typescript
// Must include these exact files:
const configFiles = [
  "vite.config.ts",      // Vite + PWA + i18n setup
  "tailwind.config.ts",  // Theme system + Nigerian color schemes
  "tsconfig.json",       // Strict TypeScript + path mapping
  "eslint.config.js",    // Linting rules
  ".prettierrc",         // Code formatting
  "src/main.tsx",        // App entry point
  "src/App.tsx",         // Root app component
  "src/app/providers/index.tsx"  // Provider composition
];
```

### **3. Example Implementation**
Create one **complete page example** demonstrating:
- Property search page with filters (mobile-first)
- Loading states with Suspense
- Error boundaries
- Theme switching
- TypeScript interfaces
- Responsive design
- Accessibility features

### **4. Integration Points**
```typescript
// API integration setup
const apiSetup = {
  baseURL: "process.env.VITE_API_URL",
  auth: "JWT tokens in httpOnly cookies",
  realtime: "Socket.IO for chat/notifications",
  payments: "Paystack/Flutterwave integration ready",
  uploads: "Cloudinary integration for images"
};
```

## **Success Criteria**

✅ **Production-ready**: Can be deployed immediately  
✅ **Type-safe**: 100% TypeScript coverage  
✅ **Performant**: <3s initial load, <100ms interactions  
✅ **Accessible**: WCAG 2.1 AA compliant  
✅ **Responsive**: Mobile-first, works on all devices  
✅ **Themeable**: All 6 Nigerian themes implemented  
✅ **Scalable**: Can handle 10,000+ concurrent users  
✅ **Maintainable**: Clear architecture, documented code  

## **Next Phase**
After this setup, I'll provide **PNG UI designs** for each page (Login, Home, Property Search, Service Booking, Dashboard, etc.) and you'll help implement pixel-perfect, responsive components for each screen.

**Note**: Focus on scaffolding and architecture - business logic will be implemented in subsequent phases with the UI designs.

---