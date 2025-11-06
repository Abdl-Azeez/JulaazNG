# 🚀 Getting Started with JulaazNG

This comprehensive guide will help you set up and run the JulaazNG platform locally on your machine.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Setup](#environment-setup)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Development Workflow](#development-workflow)
7. [Common Issues](#common-issues)
8. [Next Steps](#next-steps)

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | 20.x or higher | [nodejs.org](https://nodejs.org/) |
| **pnpm** | 9.x (recommended) | `npm install -g pnpm` |
| **PostgreSQL** | 16.x | [postgresql.org](https://www.postgresql.org/download/) |
| **Redis** | 7.x | [redis.io](https://redis.io/download) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

### Optional (but Recommended)

| Software | Purpose | Download |
|----------|---------|----------|
| **Docker** | Run PostgreSQL & Redis in containers | [docker.com](https://www.docker.com/) |
| **Docker Compose** | Manage multiple containers | Included with Docker Desktop |
| **VS Code** | Code editor | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Postman** | API testing | [postman.com](https://www.postman.com/) |

### Verify Installation

```bash
# Check Node.js version
node --version
# Should output: v20.x.x or higher

# Check pnpm version
pnpm --version
# Should output: 9.x.x or higher

# Check PostgreSQL version
psql --version
# Should output: psql (PostgreSQL) 16.x

# Check Redis version (if installed manually)
redis-cli --version
# Should output: redis-cli 7.x.x

# Check Docker version (if using Docker)
docker --version
docker-compose --version
```

---

## 📦 Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/JulaazNG.git

# Navigate to project directory
cd JulaazNG
```

### Step 2: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies using pnpm (recommended)
pnpm install

# OR using npm
npm install

# OR using yarn
yarn install
```

### Step 3: Install Backend Dependencies

```bash
# Navigate to backend directory (from project root)
cd ../backend

# Install dependencies using npm
npm install

# OR using pnpm
pnpm install

# OR using yarn
yarn install
```

---

## ⚙️ Environment Setup

### Frontend Environment Variables

```bash
# Navigate to frontend directory
cd frontend

# Copy environment template
cp ENV_TEMPLATE.md .env.local

# Open .env.local in your editor
# For VS Code users:
code .env.local

# OR use any text editor:
nano .env.local
```

**Minimal .env.local for development:**

```bash
# Application
VITE_APP_URL=http://localhost:5173
VITE_APP_ENV=development

# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000

# Feature Flags (Enable basic features)
VITE_FEATURE_ARTISAN_MARKETPLACE=true
VITE_FEATURE_PROPERTY_MANAGEMENT=true
VITE_FEATURE_SHORT_LET=true
```

> **Note:** You'll need to add payment gateway keys, Cloudinary credentials, and other service keys later for full functionality.

### Backend Environment Variables

```bash
# Navigate to backend directory
cd ../backend

# Copy environment template
cp ENV_TEMPLATE.md .env

# Open .env in your editor
code .env
# OR
nano .env
```

**Minimal .env for development:**

```bash
# Application
NODE_ENV=development
PORT=3000
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://julaazng:password123@localhost:5432/julaazng_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT (Generate secure keys for production!)
JWT_SECRET=your-development-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-development-refresh-secret-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

> **Important:** The JWT secrets above are for development only. Generate secure keys for production!

#### Generate Secure JWT Keys

```bash
# Generate JWT secret (copy output to JWT_SECRET)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate refresh secret (copy output to JWT_REFRESH_SECRET)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🗄️ Database Setup

You have two options: **Docker** (recommended) or **Manual Installation**.

### Option 1: Using Docker (Recommended)

This is the easiest way to get started. Docker Compose will set up both PostgreSQL and Redis for you.

```bash
# Navigate to backend directory
cd backend

# Start PostgreSQL and Redis containers
docker-compose up -d postgres redis

# Verify containers are running
docker-compose ps

# Expected output:
# NAME                COMMAND                  STATUS              PORTS
# backend-postgres-1  "docker-entrypoint.s…"   Up About a minute   0.0.0.0:5432->5432/tcp
# backend-redis-1     "docker-entrypoint.s…"   Up About a minute   0.0.0.0:6379->6379/tcp
```

**Useful Docker Commands:**

```bash
# View logs
docker-compose logs -f postgres
docker-compose logs -f redis

# Stop containers
docker-compose down

# Stop and remove all data (⚠️ deletes database!)
docker-compose down -v

# Restart containers
docker-compose restart postgres redis
```

### Option 2: Manual Installation

#### PostgreSQL Setup

```bash
# macOS (using Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql-16 postgresql-contrib-16
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Windows
# Download installer from postgresql.org and follow the wizard
```

**Create Database and User:**

```bash
# Connect to PostgreSQL
psql postgres

# In psql prompt, run:
CREATE DATABASE julaazng_dev;
CREATE USER julaazng WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE julaazng_dev TO julaazng;
\q
```

#### Redis Setup

```bash
# macOS (using Homebrew)
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Windows
# Download from https://redis.io/download or use WSL
```

**Test Redis Connection:**

```bash
redis-cli ping
# Should output: PONG
```

### Run Database Migrations

Once PostgreSQL is running:

```bash
# Navigate to backend directory
cd backend

# Generate Prisma client
npm run prisma:generate

# Run migrations (creates database tables)
npm run prisma:migrate

# Seed database with initial data (optional)
npm run prisma:seed

# Open Prisma Studio (Database GUI) to verify
npm run prisma:studio
# Opens at http://localhost:5555
```

---

## 🏃 Running the Application

### Start Backend Server

```bash
# Navigate to backend directory
cd backend

# Development mode (with hot reload)
npm run start:dev

# Expected output:
# [Nest] 12345 - LOG [NestFactory] Starting Nest application...
# [Nest] 12345 - LOG [InstanceLoader] AppModule dependencies initialized
# ...
# [Nest] 12345 - LOG [NestApplication] Nest application successfully started
# [Nest] 12345 - LOG Application is running on: http://localhost:3000
```

**Backend is now running at:**
- API: http://localhost:3000
- API Documentation (Swagger): http://localhost:3000/api/docs
- Health Check: http://localhost:3000/health

### Start Frontend Development Server

Open a **new terminal window/tab**:

```bash
# Navigate to frontend directory
cd frontend

# Development mode (with hot reload)
pnpm dev

# Expected output:
# VITE v5.x.x  ready in xxx ms
# 
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
# ➜  press h + enter to show help
```

**Frontend is now running at:**
- Application: http://localhost:5173

---

## 🎯 Verify Everything is Working

### 1. Check Backend Health

```bash
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","info":{"database":{"status":"up"},"redis":{"status":"up"}}}
```

### 2. Check API Documentation

Open your browser and navigate to:
- http://localhost:3000/api/docs

You should see the Swagger UI with all API endpoints.

### 3. Check Frontend

Open your browser and navigate to:
- http://localhost:5173

You should see the JulaazNG landing page.

### 4. Test API from Frontend

Try registering a new user or logging in through the frontend interface.

---

## 💻 Development Workflow

### Terminal Setup (Recommended)

Use 3 terminal windows/tabs for efficient development:

**Terminal 1: Backend**
```bash
cd backend
npm run start:dev
```

**Terminal 2: Frontend**
```bash
cd frontend
pnpm dev
```

**Terminal 3: Commands** (for running migrations, tests, etc.)
```bash
# Available for ad-hoc commands
```

### Using VS Code

**Recommended Extensions:**

1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **Prisma** - Database schema syntax highlighting
4. **Tailwind CSS IntelliSense** - Tailwind autocomplete
5. **Auto Rename Tag** - Rename HTML tags automatically
6. **GitLens** - Enhanced Git integration

**Install all at once:**

```bash
# Run this in VS Code terminal
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension Prisma.prisma
code --install-extension bradlc.vscode-tailwindcss
code --install-extension formulahendry.auto-rename-tag
code --install-extension eamodio.gitlens
```

### Code Formatting

```bash
# Frontend
cd frontend
pnpm format        # Format all files
pnpm lint          # Check for linting errors
pnpm lint:fix      # Fix linting errors

# Backend
cd backend
npm run format     # Format all files
npm run lint       # Check for linting errors
npm run lint:fix   # Fix linting errors
```

### Running Tests

```bash
# Frontend
cd frontend
pnpm test          # Run unit tests
pnpm test:watch    # Run tests in watch mode

# Backend
cd backend
npm run test       # Run unit tests
npm run test:watch # Run tests in watch mode
npm run test:e2e   # Run end-to-end tests
npm run test:cov   # Run tests with coverage
```

### Database Operations

```bash
cd backend

# Create a new migration
npm run prisma:migrate -- --name add_new_feature

# Reset database (⚠️ deletes all data!)
npm run prisma:reset

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Seed database
npm run prisma:seed
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Port Already in Use

**Error:**
```
Port 3000 is already in use
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# OR change the port in backend/.env
PORT=3001
```

### Issue 2: Database Connection Failed

**Error:**
```
Error: P1001: Can't reach database server at localhost:5432
```

**Solution:**
```bash
# Check if PostgreSQL is running
# macOS/Linux
ps aux | grep postgres

# Windows
tasklist | findstr postgres

# Start PostgreSQL
# macOS (Homebrew)
brew services start postgresql@16

# Ubuntu
sudo systemctl start postgresql

# Docker
docker-compose up -d postgres
```

### Issue 3: Redis Connection Failed

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# Start Redis
# macOS (Homebrew)
brew services start redis

# Ubuntu
sudo systemctl start redis-server

# Docker
docker-compose up -d redis
```

### Issue 4: Prisma Client Not Generated

**Error:**
```
Cannot find module '@prisma/client'
```

**Solution:**
```bash
cd backend
npm run prisma:generate
```

### Issue 5: Module Not Found (Frontend)

**Error:**
```
Failed to resolve import "..." from "..."
```

**Solution:**
```bash
cd frontend

# Clear node_modules and reinstall
rm -rf node_modules
rm pnpm-lock.yaml  # or package-lock.json
pnpm install

# Restart dev server
pnpm dev
```

### Issue 6: TypeScript Errors After Fresh Install

**Solution:**
```bash
# Frontend
cd frontend
pnpm exec tsc --noEmit

# Backend
cd backend
npm run build
```

### Issue 7: Docker Compose Issues

**Error:**
```
ERROR: Couldn't connect to Docker daemon
```

**Solution:**
```bash
# Make sure Docker Desktop is running

# macOS
open -a Docker

# Restart Docker service
# Linux
sudo systemctl restart docker

# Verify Docker is running
docker ps
```

---

## 📚 Next Steps

### 1. Explore the Codebase

**Frontend:**
- Check out `frontend/src/pages/home/` for the landing page
- Look at `frontend/src/features/auth/` for authentication logic
- Explore `frontend/src/shared/ui/` for reusable UI components

**Backend:**
- Check `backend/src/modules/auth/` for authentication endpoints
- Look at `backend/src/modules/properties/` for property management
- Explore `backend/prisma/schema.prisma` for database schema

### 2. Create Your First Feature

Follow this guide to add a new feature:
- [Creating a New Frontend Feature](frontend/README.md#creating-features)
- [Creating a New Backend Module](backend/README.md#creating-modules)

### 3. Set Up Third-Party Services

For full functionality, you'll need to set up:

**Payment Gateways:**
- [Paystack](https://paystack.com) - Nigerian payment processor
- [Flutterwave](https://flutterwave.com) - Alternative payment processor

**File Storage:**
- [Cloudinary](https://cloudinary.com) - Image/video hosting (free tier available)

**Email Service:**
- [SendGrid](https://sendgrid.com) - Email delivery (free tier: 100 emails/day)
- [Resend](https://resend.com) - Modern email API

**SMS Service:**
- [Termii](https://termii.com) - Nigerian SMS provider

**Maps:**
- [Google Maps API](https://developers.google.com/maps) - Maps and geocoding
- [Mapbox](https://www.mapbox.com) - Alternative maps provider

**Push Notifications:**
- [Firebase Cloud Messaging](https://firebase.google.com/products/cloud-messaging) - Free push notifications

### 4. Read the Documentation

- **[Project README](README.md)** - Project overview
- **[Folder Structure](FOLDER_STRUCTURE.md)** - Complete folder structure
- **[Frontend README](frontend/README.md)** - Frontend architecture
- **[Backend README](backend/README.md)** - Backend architecture
- **[PRD](Documentation/PRD.md)** - Product requirements
- **[Development Plan](Documentation/JulaazNG_development_plan.md)** - Development timeline

### 5. Join the Development

Ready to contribute?
1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run tests: `pnpm test` (frontend) or `npm test` (backend)
4. Commit: `git commit -m "feat: add your feature"`
5. Push: `git push origin feature/your-feature-name`
6. Open a Pull Request

---

## 🎓 Learning Resources

### General
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)

### Frontend
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)

### Backend
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Redis Documentation](https://redis.io/documentation)

---

## 💬 Getting Help

### Quick Help Commands

```bash
# Frontend help
cd frontend
pnpm --help
pnpm run   # List all available scripts

# Backend help
cd backend
npm run    # List all available scripts
```

### Community Support

- **GitHub Issues**: Report bugs and request features
- **Email**: support@julaazng.com
- **Documentation**: Check the `/Documentation` folder

---

## ✅ Development Checklist

Use this checklist to verify your setup:

- [ ] Node.js 20.x installed
- [ ] pnpm/npm installed
- [ ] PostgreSQL 16.x running
- [ ] Redis 7.x running (optional but recommended)
- [ ] Git repository cloned
- [ ] Frontend dependencies installed
- [ ] Backend dependencies installed
- [ ] Frontend `.env.local` configured
- [ ] Backend `.env` configured
- [ ] Database created
- [ ] Migrations run successfully
- [ ] Backend server starts without errors
- [ ] Frontend dev server starts without errors
- [ ] API documentation accessible (http://localhost:3000/api/docs)
- [ ] Frontend loads successfully (http://localhost:5173)
- [ ] Health check passes (http://localhost:3000/health)

---

## 🎉 You're All Set!

Congratulations! You now have JulaazNG running locally. Happy coding! 🚀

For questions or issues, please refer to:
- [Project README](README.md)
- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [GitHub Issues](https://github.com/yourusername/JulaazNG/issues)

**Next**: Start exploring the codebase and building amazing features! 💪

