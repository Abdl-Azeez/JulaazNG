# 🏠 JulaazNG - Nigeria's Property & Services Marketplace

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.5-blue.svg)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/react-18-61dafb.svg)](https://reactjs.org)
[![NestJS](https://img.shields.io/badge/nestjs-10-e0234e.svg)](https://nestjs.com)

## 🎯 Overview

**JulaazNG** is a comprehensive property rental and services marketplace platform designed specifically for the Nigerian market. It connects tenants, landlords, service providers, artisans, and property managers in a trusted, secure, and efficient ecosystem.

### Key Features
- 🏘️ **Property Rentals** - Long-term & short-let (Airbnb-style)
- 🧹 **Service Marketplace** - Cleaning, moving, maintenance
- 🔧 **Artisan Network** - On-demand skilled tradespeople (electrical, plumbing, carpentry, etc.)
- 🏢 **Property Management** - Standard & premium with security monitoring
- 💳 **Payment Integration** - Paystack & Flutterwave
- 💬 **Real-time Messaging** - Socket.IO powered
- 🌍 **Multi-language** - English, Yoruba, Hausa, Igbo
- 📱 **Mobile-First PWA** - Offline-capable

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x
- pnpm or npm
- PostgreSQL 16.x
- Redis 7.x (optional)
- Docker (recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/JulaazNG.git
cd JulaazNG
```

2. **Install dependencies**
```bash
# Frontend
cd frontend && pnpm install

# Backend
cd ../backend && npm install
```

3. **Set up environment**
```bash
# Frontend: Create .env.local
cd frontend
cp frontend/ENV_TEMPLATE.md .env.local
# Edit .env.local with your config

# Backend: Create .env
cd backend
cp backend/ENV_TEMPLATE.md .env
# Edit .env with your config
```

4. **Start services**
```bash
# Start database (Docker)
cd backend
docker-compose up -d postgres redis

# Run migrations
npm run prisma:migrate

# Start backend (new terminal)
npm run start:dev

# Start frontend (new terminal)
cd frontend
pnpm dev
```

### Access Points
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Docs:** http://localhost:3000/api/docs

**📖 For detailed setup instructions, see [SETUP.md](SETUP.md)**

---

## 🏗️ Project Structure

```
JulaazNG/
├── frontend/              # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── app/           # Application layer
│   │   ├── pages/         # Route components
│   │   ├── features/      # Business logic
│   │   ├── entities/      # Data models
│   │   ├── widgets/       # Complex UI
│   │   ├── shared/        # Reusable utilities
│   │   └── assets/        # Static files (logo, icon)
│   └── public/            # Public assets
│
├── backend/               # NestJS + TypeScript + Prisma
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── common/        # Utilities
│   │   ├── infrastructure/ # External services
│   │   ├── modules/       # Domain modules
│   │   └── health/        # Health checks
│   └── prisma/            # Database schema
│
└── Documentation/         # Complete documentation
    ├── PRD.md                      # Product Requirements
    ├── GETTING_STARTED.md          # Detailed setup guide
    ├── FOLDER_STRUCTURE.md         # Complete folder tree
    └── UI/                         # Design mockups
```

---

## 📦 Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript + Vite
- **State:** Zustand + TanStack Query v5
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms:** React Hook Form + Zod
- **Real-time:** Socket.IO client
- **PWA:** Vite PWA plugin

### Backend
- **Framework:** NestJS 10 + TypeScript
- **Database:** PostgreSQL 16 + Prisma 5
- **Auth:** JWT (access + refresh tokens)
- **Cache:** Redis 7
- **Real-time:** Socket.IO
- **Docs:** Swagger/OpenAPI

### Infrastructure
- **Payment:** Paystack, Flutterwave
- **Email:** SendGrid, Resend
- **SMS:** Termii
- **Storage:** Cloudinary / AWS S3
- **Maps:** Google Maps / Mapbox
- **Monitoring:** Sentry

---

## 🎨 Design System

### 6 Nigerian Themes
1. 🌿 **Naija Fresh** (Default) - Green/Nature
2. 🌃 **Eko Luxe** - Lagos Premium, Dark Gold
3. 🏜️ **Arewa Calm** - Northern Nigeria, Earth Tones
4. 🏠 **Ụlọ Oma** - Igbo Heritage, Red/Traditional
5. 🌧️ **Rainy 9ja** - Lagos Rainy Season, Blue
6. 🎨 **Ajébo Blend** - Modern Nigerian, Purple

### Design Principles
- **Mobile-first** - Optimized for mobile devices
- **Accessible** - WCAG 2.1 AA compliant
- **Performant** - Core Web Vitals optimized
- **Responsive** - Works on all screen sizes

---

## 👥 User Roles

- **Tenant** - Search and book properties
- **Landlord** - List and manage properties
- **Service Provider** - Offer cleaning, moving services
- **Artisan** - Provide skilled trade services
- **Property Manager** - Manage properties for landlords
- **Admin** - Platform administration

---

## 💰 Business Model

### Revenue Streams
- **Rental Commission:** 5-8% of annual rent
- **Service Booking:** 10-15% commission
- **Artisan Services:** 12-18% + diagnostic fees (₦2,000-₦5,000)
- **Property Management:** 8-12% (standard), 15-20% (premium with security)
- **Premium Listings:** ₦2,000-₦10,000/month

### Year 1 Target (Lagos)
- **Total Revenue:** ₦153M (~$329K)
- **Properties:** 500 listings
- **Services:** 200 bookings/month
- **Artisans:** 300 jobs/month

---

## 🗺️ Roadmap

### Phase 1: MVP (Months 1-3) - Current
- ✅ Project structure complete
- ✅ Tech stack configured
- 🔄 User authentication
- 🔄 Property listings
- 🔄 Basic booking
- 🔄 Payment integration

### Phase 2: Enhanced (Months 4-6)
- Service marketplace
- Artisan network
- Advanced search
- Review system
- Verification
- Multi-language

### Phase 3: Scale (Months 7-12)
- Premium property management
- Security monitoring
- AI recommendations
- Advanced analytics
- Market expansion

---

## 📚 Documentation

### Quick Links
- **[SETUP.md](SETUP.md)** - Quick setup guide
- **[Documentation/GETTING_STARTED.md](Documentation/GETTING_STARTED.md)** - Detailed setup
- **[Documentation/FOLDER_STRUCTURE.md](Documentation/FOLDER_STRUCTURE.md)** - Complete structure
- **[Documentation/PRD.md](Documentation/PRD.md)** - Product requirements
- **[frontend/README.md](frontend/README.md)** - Frontend guide
- **[backend/README.md](backend/README.md)** - Backend guide

### Environment Setup
- **[frontend/ENV_TEMPLATE.md](frontend/ENV_TEMPLATE.md)** - Frontend variables
- **[backend/ENV_TEMPLATE.md](backend/ENV_TEMPLATE.md)** - Backend variables

---

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm lint         # Check code
pnpm test         # Run tests
```

**Backend:**
```bash
npm run start:dev         # Start with hot reload
npm run build             # Build for production
npm run prisma:studio     # Database GUI
npm run test              # Run tests
```

### Code Quality
- **TypeScript** strict mode
- **ESLint** + **Prettier** configured
- **Husky** git hooks
- **Conventional Commits** enforced

---

## 🔐 Security

- JWT authentication with HTTP-only cookies
- Role-based access control (RBAC)
- AES-256 encryption for sensitive data
- API rate limiting & CORS protection
- PCI-DSS compliant payments
- GDPR + Nigerian Data Protection compliance

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Follow commit conventions
4. Write tests
5. Open a Pull Request

---

## 📄 License

Proprietary - All rights reserved © 2025 JulaazNG

---

## 📞 Support

- **Email:** support@julaazng.com
- **Website:** https://julaazng.com
- **Issues:** [GitHub Issues](https://github.com/yourusername/JulaazNG/issues)

---

## 🙏 Acknowledgments

Built with:
- **React** - UI library
- **NestJS** - Backend framework
- **Prisma** - Database ORM
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling

---

**🇳🇬 Built with ❤️ for Nigeria**

*Transforming Nigeria's property rental market, one connection at a time.*
