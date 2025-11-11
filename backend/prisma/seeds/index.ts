import { PrismaClient, UserRole, UserStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const demoUsers = [
  {
    email: 'tenant@julaaz.com',
    phone: '08010000001',
    password: 'tenant123',
    firstName: 'Tosin',
    lastName: 'Adeyemi',
    roles: [UserRole.TENANT],
    preferredRole: UserRole.TENANT,
  },
  {
    email: 'landlord@julaaz.com',
    phone: '08010000002',
    password: 'landlord123',
    firstName: 'Femi',
    lastName: 'Ogunleye',
    roles: [UserRole.LANDLORD],
    preferredRole: UserRole.LANDLORD,
  },
  {
    email: 'hybrid@julaaz.com',
    phone: '08010000003',
    password: 'hybrid123',
    firstName: 'Chioma',
    lastName: 'Nwosu',
    roles: [UserRole.TENANT, UserRole.LANDLORD],
    preferredRole: UserRole.TENANT,
  },
]

async function seedDemoUsers() {
  for (const user of demoUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10)

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        phone: user.phone,
        password: hashedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        preferredRole: user.preferredRole,
        status: UserStatus.ACTIVE,
        lastLoginAt: new Date(),
      },
      create: {
        email: user.email,
        phone: user.phone,
        password: hashedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        preferredRole: user.preferredRole,
        status: UserStatus.ACTIVE,
        lastLoginAt: new Date(),
      },
    })
  }
}

async function main() {
  console.info('🌱 Seeding demo users...')
  await seedDemoUsers()
  console.info('✅ Demo users ready.')
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


