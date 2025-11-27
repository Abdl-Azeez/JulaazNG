# Test Credentials

This document contains all test user credentials for the JulaazNG platform.

## 🔐 Demo User Accounts

### Tenant
- **Email:** `tenant@julaaz.com`
- **Phone:** `08010000001`
- **Password:** `tenant123`
- **Role:** Tenant
- **Access:** Property search, bookings, payments, agreements

### Landlord
- **Email:** `landlord@julaaz.com`
- **Phone:** `08010000002`
- **Password:** `landlord123`
- **Role:** Landlord
- **Access:** Property management, applications, earnings

### Hybrid User (Tenant + Landlord)
- **Email:** `hybrid@julaaz.com`
- **Phone:** `08010000003`
- **Password:** `hybrid123`
- **Roles:** Tenant, Landlord
- **Access:** All tenant and landlord features

### Homerunner
- **Email:** `homerunner@julaaz.com`
- **Phone:** `08010000006`
- **Password:** `homerunner123`
- **Role:** Homerunner
- **Access:** 
  - Property inspections
  - Property viewings
  - Earnings dashboard
  - Schedule management

### Admin
- **Email:** `admin@julaaz.com`
- **Phone:** `08010000007`
- **Password:** `admin123`
- **Role:** Admin
- **Access:**
  - Admin dashboard
  - Approvals center
  - Analytics
  - User management
  - Property management
  - Service management
  - Payment management
  - Dispute resolution

## 🚀 Setting Up Test Users

To create these test users in your database, run:

```bash
cd backend
npm run prisma:seed
```

This will create all demo users with the credentials listed above.

## 📝 Notes

- All test users are set to `ACTIVE` status
- Passwords are hashed using bcrypt
- Users are created with `lastLoginAt` set to current date
- If a user already exists, the seed script will update their information

## 🔄 Resetting Test Data

To reset the database and re-seed:

```bash
cd backend
npm run prisma:reset
npm run prisma:seed
```

⚠️ **Warning:** This will delete all existing data in the database!

## 🧪 Testing Different Roles

1. **Login** with any of the credentials above
2. You'll be redirected to the appropriate dashboard based on your role:
   - Tenant → Home page
   - Landlord → `/landlord/properties`
   - Homerunner → `/homerunner/dashboard`
   - Admin → `/admin/dashboard`
3. Use the sidebar menu to navigate to role-specific features

## 🔑 Super Admin (Initial Setup)

For the initial super admin account (created on first setup):

- **Email:** `admin@julaazng.com` (from environment variables)
- **Password:** `ChangeThisSecurePassword123!` (from environment variables)
- **Role:** SUPER_ADMIN

This is configured in your `.env` file:
```
SUPER_ADMIN_EMAIL=admin@julaazng.com
SUPER_ADMIN_PASSWORD=ChangeThisSecurePassword123!
```

