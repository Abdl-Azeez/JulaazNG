# 🚀 Getting Started with JulaazNG

**Complete Setup Guide for Development Environment**

**Date:** January 2026  
**Status:** ✅ Complete  
**Project:** JulaazNG - Nigeria's Property & Services Marketplace

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Setup (3 Steps)](#quick-setup-3-steps)
3. [Detailed Setup](#detailed-setup)
4. [Project Structure](#project-structure)
5. [Architecture Overview](#architecture-overview)
6. [Development Workflow](#development-workflow)
7. [Useful Commands](#useful-commands)
8. [Troubleshooting](#troubleshooting)
9. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **pnpm** 8.x or higher (`npm install -g pnpm`)
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))
- **PostgreSQL** 16.x (optional, if not using Docker)
- **Redis** 7.x (optional, if not using Docker)

### Recommended Tools

- **VS Code** with extensions:
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense
- **Postman** or **Insomnia** (for API testing)
- **DBeaver** or **pgAdmin** (for database management)

---

## Quick Setup (3 Steps)

### Step 1: Install Dependencies

**Frontend:**
```bash
cd frontend
pnpm install
# or: npm install
```

**Backend:**
```bash
cd backend
npm install
```

### Step 2: Set Up Environment

**Frontend** - Create `.env.local`:
```bash
cd frontend
touch .env.local
```

Add minimal config:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_URL=http://localhost:5173
```

**Backend** - Create `.env`:
```bash
cd backend
touch .env
```

Add minimal config:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://julaazng:password123@localhost:5432/julaazng_dev
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-min-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
```

> **Note:** For complete environment variable lists, see:
> - [Frontend ENV Template](../frontend/ENV_TEMPLATE.md)
> - [Backend ENV Template](../backend/ENV_TEMPLATE.md)

### Step 3: Start Services

**Terminal 1 - Database (Docker):**
```bash
cd backend
docker-compose up -d postgres redis
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
pnpm dev
```

---

## Detailed Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd JulaazNG
```

### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
pnpm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. Environment Configuration

#### Frontend Environment

Create `frontend/.env.local`:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_APP_URL=http://localhost:5173

# Feature Flags
VITE_FEATURE_ARTISAN_MARKETPLACE=true
VITE_FEATURE_PROPERTY_MANAGEMENT=true
VITE_FEATURE_SHORT_LET=true

# Internationalization
VITE_I18N_DEFAULT_LOCALE=en-NG
VITE_I18N_AVAILABLE_LOCALES=en-NG,yo,ha,ig

# Theme
VITE_DEFAULT_THEME=naija-fresh
```

See [frontend/ENV_TEMPLATE.md](../frontend/ENV_TEMPLATE.md) for complete list.

#### Backend Environment

Create `backend/.env`:

```env
# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://julaazng:password123@localhost:5432/julaazng_dev

# Authentication
JWT_SECRET=your-secret-key-min-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Payment (Get from providers)
PAYSTACK_SECRET_KEY=sk_test_...
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...
```

See [backend/ENV_TEMPLATE.md](../backend/ENV_TEMPLATE.md) for complete list.

### 4. Database Setup

#### Option A: Using Docker (Recommended)

```bash
cd backend
docker-compose up -d postgres redis
```

This starts:
- PostgreSQL 16 on port 5432
- Redis 7 on port 6379

#### Option B: Manual Installation

1. Install PostgreSQL 16
2. Create database:
```sql
CREATE DATABASE julaazng_dev;
CREATE USER julaazng WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE julaazng_dev TO julaazng;
```

3. Install Redis 7
4. Start Redis service

### 5. Run Migrations

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed  # Optional: Seed sample data
```

### 6. Start Development Servers

**Backend:**
```bash
cd backend
npm run start:dev
```

**Frontend:**
```bash
cd frontend
pnpm dev
```

---

## Access Points

Once running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Docs (Swagger):** http://localhost:3000/api/docs
- **Prisma Studio:** `npm run prisma:studio` (http://localhost:5555)
- **Health Check:** http://localhost:3000/health

---

## Project Structure

```
JulaazNG/
├── frontend/                    # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── app/                 # Application layer
│   │   ├── pages/               # Route components
│   │   ├── features/            # Business logic
│   │   ├── entities/            # Data models
│   │   ├── widgets/             # Complex UI
│   │   ├── shared/              # Reusable utilities
│   │   ├── assets/              # Static files
│   │   └── styles/              # Global styles
│   ├── README.md                # Frontend documentation
│   └── ENV_TEMPLATE.md          # Environment variables guide
│
├── backend/                     # NestJS + TypeScript + Prisma
│   ├── src/
│   │   ├── config/              # Configuration
│   │   ├── common/              # Shared utilities
│   │   ├── infrastructure/      # External services
│   │   ├── modules/             # Domain modules
│   │   └── health/              # Health checks
│   ├── prisma/                  # Database schema
│   ├── README.md                # Backend documentation
│   └── ENV_TEMPLATE.md          # Environment variables guide
│
└── Documentation/               # Project documentation
    ├── PRD.md                   # Product Requirements
    ├── FOLDER_STRUCTURE.md      # Complete folder tree
    ├── GETTING_STARTED.md       # This file
    └── ...                      # Other docs
```

> **For complete folder structure, see [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)**

---

## Architecture Overview

### Frontend: Feature-Sliced Design (FSD)

**Architecture Layers:**
1. **app/** - Application initialization (Providers, Router, Stores)
2. **pages/** - Route entry points (Login, Home, Dashboard)
3. **features/** - Business logic (Auth, Properties, Services, Artisans)
4. **entities/** - Data models (User, Property, Booking types)
5. **widgets/** - Complex UI (Header, Cards, Chat)
6. **shared/** - Reusable utilities (UI components, Hooks, Utils)

**Key Features:**
- 🎨 6 Nigerian-themed color schemes
- 🌍 Multi-language support (English, Yoruba, Hausa, Igbo)
- 📱 Progressive Web App (PWA)
- 🔄 Real-time messaging (Socket.IO)
- 💳 Payment integration (Paystack, Flutterwave)
- 🎯 Type-safe with TypeScript

### Backend: Domain-Driven Design (DDD)

**Architecture Layers:**
1. **config/** - Application configuration
2. **common/** - Shared utilities (Guards, Decorators, Pipes)
3. **infrastructure/** - External services (Database, Cache, Email, Payment)
4. **modules/** - Domain logic (Auth, Properties, Artisans, Bookings)
5. **health/** - Health check endpoints

**Key Features:**
- 🔐 JWT authentication with refresh tokens
- 🗄️ PostgreSQL + Prisma ORM
- ⚡ Redis caching
- 📧 Multi-channel notifications (Email, SMS, Push)
- 💰 Payment gateway integration
- 🤖 AI-powered features (OpenAI)
- 🔄 Real-time WebSocket (Socket.IO)

> **For detailed architecture, see:**
> - [Frontend README](../frontend/README.md)
> - [Backend README](../backend/README.md)
> - [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)

---

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Development

**Frontend:**
- Add pages in `src/pages/`
- Add business logic in `src/features/`
- Add UI components in `src/shared/ui/`
- Add types in `src/entities/*/model/`

**Backend:**
- Add modules in `src/modules/`
- Update database schema in `prisma/schema.prisma`
- Run migrations: `npm run prisma:migrate`

### 3. Testing

**Frontend:**
```bash
cd frontend
pnpm test
pnpm test:coverage
```

**Backend:**
```bash
cd backend
npm run test
npm run test:e2e
npm run test:cov
```

### 4. Code Quality

**Linting:**
```bash
# Frontend
cd frontend && pnpm lint

# Backend
cd backend && npm run lint
```

**Formatting:**
```bash
# Frontend
cd frontend && pnpm format

# Backend
cd backend && npm run format
```

### 5. Commit & Push

```bash
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

---

## Useful Commands

### Frontend Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm lint             # Check code
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code
pnpm type-check       # TypeScript type checking
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
```

### Backend Commands

```bash
npm run start:dev     # Start with hot reload
npm run start:prod    # Start production server
npm run build         # Build for production
npm run lint          # Check code
npm run lint:fix      # Fix linting issues
npm run format        # Format code
npm run test          # Run unit tests
npm run test:e2e      # Run E2E tests
npm run test:cov      # Run tests with coverage

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio
npm run prisma:seed        # Seed database
npm run prisma:reset      # Reset database
```

### Docker Commands

```bash
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose logs -f postgres   # View PostgreSQL logs
docker-compose logs -f redis      # View Redis logs
docker-compose restart            # Restart services
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or change PORT in .env
```

#### 2. Database Connection Error

**Error:** `Can't reach database server`

**Solutions:**
- Check Docker is running: `docker ps`
- Verify DATABASE_URL in `.env`
- Restart Docker: `docker-compose restart postgres`
- Check PostgreSQL logs: `docker-compose logs postgres`

#### 3. Prisma Client Not Generated

**Error:** `@prisma/client did not initialize yet`

**Solution:**
```bash
cd backend
npm run prisma:generate
```

#### 4. Module Not Found

**Error:** `Cannot find module`

**Solutions:**
- Reinstall dependencies: `pnpm install` or `npm install`
- Clear cache: `rm -rf node_modules .next` (if applicable)
- Check import paths (use `@/` prefix for absolute imports)

#### 5. Environment Variables Not Loading

**Solutions:**
- Ensure `.env.local` (frontend) or `.env` (backend) exists
- Restart dev server after adding new variables
- Check variable names match exactly (case-sensitive)

#### 6. CORS Errors

**Error:** `Access to fetch has been blocked by CORS policy`

**Solution:**
- Verify `FRONTEND_URL` in backend `.env` matches frontend URL
- Check CORS configuration in backend

---

## Next Steps

### 1. Review Documentation

- [README.md](../readme.md) - Project overview
- [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) - Complete folder tree
- [PRD.md](PRD.md) - Product requirements
- [Frontend README](../frontend/README.md) - Frontend architecture
- [Backend README](../backend/README.md) - Backend architecture

### 2. Explore the Codebase

- Check out existing pages in `frontend/src/pages/`
- Review API structure in `backend/src/modules/`
- Explore UI components in `frontend/src/shared/ui/`

### 3. Start Building

- Pick a feature from the [PRD.md](PRD.md)
- Create a feature branch
- Follow the development workflow
- Write tests
- Submit a PR

### 4. Development Phases

**Phase 1: MVP (Months 1-3)**
- User authentication & profiles
- Property listing & search
- Basic booking system
- Payment integration (Paystack)
- Admin dashboard

**Phase 2: Enhanced Features (Months 4-6)**
- Service marketplace
- Artisan network
- Advanced search & filters
- Review & rating system
- Verification system

**Phase 3: Advanced Features (Months 7-12)**
- Premium property management
- Security monitoring (cameras)
- AI-powered recommendations
- Advanced analytics
- Market expansion

---

## ✅ Setup Checklist

Use this checklist to verify everything is set up:

### Prerequisites
- [ ] Node.js 20.x installed
- [ ] pnpm installed
- [ ] Docker Desktop installed and running
- [ ] Git installed

### Installation
- [ ] Repository cloned
- [ ] Frontend dependencies installed (`pnpm install`)
- [ ] Backend dependencies installed (`npm install`)

### Configuration
- [ ] Frontend `.env.local` created
- [ ] Backend `.env` created
- [ ] Environment variables configured

### Database
- [ ] Docker services running (`docker-compose up -d`)
- [ ] Prisma Client generated (`npm run prisma:generate`)
- [ ] Migrations run (`npm run prisma:migrate`)
- [ ] Database seeded (optional: `npm run prisma:seed`)

### Development
- [ ] Backend server running (`npm run start:dev`)
- [ ] Frontend server running (`pnpm dev`)
- [ ] Can access frontend at http://localhost:5173
- [ ] Can access API at http://localhost:3000
- [ ] Can access API docs at http://localhost:3000/api/docs

---

## 🎨 Design System

### Themes

Six Nigerian-themed color schemes:

1. **🌿 Naija Fresh** (Default) - Green/Nature
2. **🌃 Eko Luxe** - Lagos Premium, Dark Gold
3. **🏜️ Arewa Calm** - Northern Nigeria, Earth Tones
4. **🏠 Ụlọ Oma** - Igbo Heritage, Red/Traditional
5. **🌧️ Rainy 9ja** - Lagos Rainy Season, Blue/Cool
6. **🎨 Ajébo Blend** - Modern Nigerian, Purple/Tech

### Design Principles

- Mobile-first approach
- WCAG 2.1 AA accessibility
- Core Web Vitals optimization
- Responsive across all devices
- Intuitive navigation

---

## 📞 Support & Resources

### Documentation
- **Main README:** [README.md](../readme.md)
- **Folder Structure:** [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)
- **Frontend Guide:** [frontend/README.md](../frontend/README.md)
- **Backend Guide:** [backend/README.md](../backend/README.md)
- **PRD:** [PRD.md](PRD.md)

### External Resources
- **React:** https://react.dev
- **NestJS:** https://docs.nestjs.com
- **Prisma:** https://www.prisma.io/docs
- **Tailwind CSS:** https://tailwindcss.com
- **shadcn/ui:** https://ui.shadcn.com

### Contact
- **Email:** support@julaazng.com
- **GitHub:** Create an issue for bugs/features

---

**Built with ❤️ for the Nigerian property market**

*Last Updated: January 2026*
