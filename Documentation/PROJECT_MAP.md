# 🗺️ JulaazNG Project Map

**Quick navigation guide to help you find what you need**

---

## 📖 Start Here

New to the project? Follow this path:

```
1. README.md                    # Project overview
   ↓
2. GETTING_STARTED.md          # Setup instructions
   ↓
3. FOLDER_STRUCTURE.md         # Architecture guide
   ↓
4. frontend/README.md           # Frontend deep dive
   OR
   backend/README.md            # Backend deep dive
```

---

## 🎯 Quick Links by Task

### I want to understand the project
- **Project overview**: [README.md](README.md)
- **Business requirements**: [Documentation/PRD.md](Documentation/PRD.md)
- **Development timeline**: [Documentation/JulaazNG_development_plan.md](Documentation/JulaazNG_development_plan.md)
- **Design guidelines**: [Documentation/Designer_Summary.md](Documentation/Designer_Summary.md)

### I want to set up my environment
- **Setup guide**: [GETTING_STARTED.md](GETTING_STARTED.md)
- **Frontend environment**: [frontend/ENV_TEMPLATE.md](frontend/ENV_TEMPLATE.md)
- **Backend environment**: [backend/ENV_TEMPLATE.md](backend/ENV_TEMPLATE.md)

### I want to understand the architecture
- **Complete folder structure**: [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)
- **Frontend architecture**: [frontend/README.md](frontend/README.md)
- **Backend architecture**: [backend/README.md](backend/README.md)

### I want to start coding
- **Frontend README**: [frontend/README.md](frontend/README.md) - See "Development Guidelines"
- **Backend README**: [backend/README.md](backend/README.md) - See "Development Guidelines"
- **Setup summary**: [PROJECT_SETUP_SUMMARY.md](PROJECT_SETUP_SUMMARY.md)

---

## 📁 File Directory

### Root Level

```
JulaazNG/
├── 📄 README.md                        # Project overview & quick start
├── 📄 GETTING_STARTED.md               # Detailed setup guide
├── 📄 FOLDER_STRUCTURE.md              # Complete folder tree
├── 📄 PROJECT_SETUP_SUMMARY.md         # Setup completion summary
├── 📄 PROJECT_MAP.md                   # This file - Navigation guide
├── 📁 frontend/                        # React application
├── 📁 backend/                         # NestJS API
├── 📁 Documentation/                   # Project documentation
├── 🎨 logo.svg                         # Company logo
└── 🎨 icon.svg                         # App icon
```

### Frontend Structure

```
frontend/
├── 📄 README.md                        # Frontend architecture & guidelines
├── 📄 ENV_TEMPLATE.md                  # Environment variables guide
├── 📁 src/
│   ├── 📁 app/                         # 🔴 Application layer
│   ├── 📁 pages/                       # 🟢 Pages layer
│   ├── 📁 features/                    # 🔵 Features layer
│   ├── 📁 entities/                    # 🟡 Entities layer
│   ├── 📁 widgets/                     # 🟣 Widgets layer
│   ├── 📁 shared/                      # ⚪ Shared layer
│   └── 📁 styles/                      # Global styles
├── 📁 public/                          # Static assets
└── ⚙️ Configuration files
```

### Backend Structure

```
backend/
├── 📄 README.md                        # Backend architecture & guidelines
├── 📄 ENV_TEMPLATE.md                  # Environment variables guide
├── 📁 src/
│   ├── 📁 config/                      # 🟦 Configuration
│   ├── 📁 common/                      # 🟪 Shared utilities
│   ├── 📁 infrastructure/              # 🟧 External services
│   ├── 📁 modules/                     # 🟩 Domain modules
│   └── 📁 health/                      # Health checks
├── 📁 prisma/                          # Database schema
└── ⚙️ Configuration files
```

### Documentation

```
Documentation/
├── 📄 PRD.md                           # Product Requirements Document
├── 📄 JulaazNG_development_plan.md     # Development timeline
├── 📄 Designer_Summary.md              # Design guidelines
├── 📄 System_Prompt.md                 # AI assistant context
└── 📁 UI/                              # Design mockups
```

---

## 🎯 Common Tasks Map

### Task: Add a New Feature

**Frontend:**
1. Create feature in `frontend/src/features/your-feature/`
2. Add types in `frontend/src/entities/your-entity/model/`
3. Create page in `frontend/src/pages/your-page/`
4. Add route in `frontend/src/app/router/routes.tsx`

**Backend:**
1. Create module in `backend/src/modules/your-module/`
2. Add DTOs in `your-module/dto/`
3. Add controller in `your-module.controller.ts`
4. Add service in `your-module.service.ts`
5. Update database in `backend/prisma/schema.prisma`
6. Run migration: `npm run prisma:migrate`

### Task: Debug an Issue

**Check these locations:**
- Frontend errors: Browser console + `frontend/src/`
- Backend errors: Terminal logs + `backend/src/modules/`
- Database issues: `backend/prisma/schema.prisma`
- API issues: http://localhost:3000/api/docs
- Environment issues: `.env.local` (frontend) or `.env` (backend)

### Task: Update Database

1. Edit schema: `backend/prisma/schema.prisma`
2. Create migration: `npm run prisma:migrate -- --name your_change`
3. Apply migration: `npm run prisma:migrate`
4. Generate client: `npm run prisma:generate`
5. View data: `npm run prisma:studio`

### Task: Add UI Component

**Using shadcn/ui (recommended):**
```bash
cd frontend
npx shadcn-ui@latest add button
# Component will be added to src/shared/ui/button/
```

**Custom component:**
1. Create in `frontend/src/shared/ui/your-component/`
2. Export from `your-component/index.ts`
3. Import where needed: `import { YourComponent } from '@/shared/ui/your-component'`

### Task: Run Tests

**Frontend:**
```bash
cd frontend
pnpm test                # Run all tests
pnpm test:watch          # Watch mode
pnpm test:coverage       # With coverage
```

**Backend:**
```bash
cd backend
npm run test             # Unit tests
npm run test:e2e         # E2E tests
npm run test:cov         # With coverage
```

---

## 🔍 Finding Code

### By Feature

| Feature | Frontend Location | Backend Location |
|---------|------------------|------------------|
| **Authentication** | `features/auth/` | `modules/auth/` |
| **Properties** | `features/properties/` | `modules/properties/` |
| **Services** | `features/services/` | `modules/services/` |
| **Artisans** | `features/artisans/` | `modules/artisans/` |
| **Property Management** | `features/property-management/` | `modules/property-management/` |
| **Bookings** | `features/bookings/` | `modules/bookings/` |
| **Payments** | `features/payments/` | `modules/payments/` |
| **Messaging** | `features/messaging/` | `modules/messaging/` |
| **Notifications** | `features/notifications/` | `modules/notifications/` |
| **Reviews** | `features/reviews/` | `modules/reviews/` |
| **Admin** | `features/admin/` | `modules/admin/` |

### By Component Type

| Component | Frontend Location | Backend Location |
|-----------|------------------|------------------|
| **UI Components** | `shared/ui/` | N/A |
| **Custom Hooks** | `shared/hooks/` | N/A |
| **API Client** | `shared/lib/api/` | N/A |
| **Utilities** | `shared/lib/utils/` | `common/utils/` |
| **Types** | `entities/*/model/` | `modules/*/dto/` |
| **Constants** | `shared/constants/` | `common/constants/` |
| **Guards** | N/A | `common/guards/` |
| **Interceptors** | N/A | `common/interceptors/` |
| **Filters** | N/A | `common/filters/` |
| **External Services** | N/A | `infrastructure/` |

### By User Role

| Page | Frontend Location |
|------|------------------|
| **Tenant Dashboard** | `pages/dashboard/tenant/` |
| **Landlord Dashboard** | `pages/dashboard/landlord/` |
| **Service Provider Dashboard** | `pages/dashboard/service-provider/` |
| **Artisan Dashboard** | `pages/dashboard/artisan/` |
| **Property Manager Dashboard** | `pages/dashboard/property-manager/` |
| **Admin Panel** | `pages/admin/` |

---

## 📚 Documentation Index

### Getting Started
- [Main README](README.md) - Project overview
- [Getting Started Guide](GETTING_STARTED.md) - Setup instructions
- [Project Setup Summary](PROJECT_SETUP_SUMMARY.md) - What's been created

### Architecture
- [Folder Structure](FOLDER_STRUCTURE.md) - Complete folder tree
- [Frontend Architecture](frontend/README.md) - FSD architecture
- [Backend Architecture](backend/README.md) - DDD architecture

### Configuration
- [Frontend Environment](frontend/ENV_TEMPLATE.md) - FE environment variables
- [Backend Environment](backend/ENV_TEMPLATE.md) - BE environment variables

### Business
- [PRD](Documentation/PRD.md) - Product requirements
- [Development Plan](Documentation/JulaazNG_development_plan.md) - Timeline
- [Design Summary](Documentation/Designer_Summary.md) - UI/UX guidelines

---

## 🔗 External Resources

### Frontend Technologies
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

### Backend Technologies
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Redis Documentation](https://redis.io/documentation)
- [Socket.IO](https://socket.io/docs/)

### Third-Party Services
- [Paystack API](https://paystack.com/docs)
- [Flutterwave API](https://developer.flutterwave.com/)
- [Cloudinary](https://cloudinary.com/documentation)
- [SendGrid](https://docs.sendgrid.com/)
- [Termii](https://developers.termii.com/)
- [Firebase](https://firebase.google.com/docs)
- [Google Maps API](https://developers.google.com/maps)

---

## 🆘 Troubleshooting Guide

### Issue: Can't find a file
1. Check [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) for complete tree
2. Use search in your editor (Cmd/Ctrl + P in VS Code)
3. Check the appropriate layer (app, pages, features, etc.)

### Issue: Don't know where to add code
1. **New page?** → `frontend/src/pages/`
2. **Business logic?** → `frontend/src/features/`
3. **API endpoint?** → `backend/src/modules/`
4. **Reusable component?** → `frontend/src/shared/ui/`
5. **External service?** → `backend/src/infrastructure/`

### Issue: Setup problems
1. Check [GETTING_STARTED.md](GETTING_STARTED.md)
2. Verify environment variables (ENV_TEMPLATE files)
3. Check "Common Issues" section in Getting Started guide
4. Ensure PostgreSQL and Redis are running

### Issue: Architecture questions
1. Read [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)
2. Check relevant README ([frontend](frontend/README.md) or [backend](backend/README.md))
3. Look at "Architecture Comparison" section

---

## ✅ Quick Reference

### Important Commands

**Frontend:**
```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm lint             # Check code
pnpm test             # Run tests
```

**Backend:**
```bash
npm run start:dev     # Start dev server
npm run build         # Build for production
npm run prisma:studio # Open database GUI
npm run test          # Run tests
```

### Important URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api/docs
- Prisma Studio: http://localhost:5555
- Health Check: http://localhost:3000/health

### Important Paths

- Frontend code: `frontend/src/`
- Backend code: `backend/src/`
- Database schema: `backend/prisma/schema.prisma`
- Environment files: `.env.local` (FE), `.env` (BE)
- Documentation: `Documentation/`

---

## 🎯 Your Next Steps

1. **First time here?**
   - Read [README.md](README.md)
   - Follow [GETTING_STARTED.md](GETTING_STARTED.md)

2. **Ready to code?**
   - Check [frontend/README.md](frontend/README.md) or [backend/README.md](backend/README.md)
   - Review [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)

3. **Need help?**
   - Check this Project Map
   - Search documentation
   - Review code examples in the structure

---

**💡 Tip:** Bookmark this page for quick navigation!

**Last Updated:** November 5, 2025

