import { PrismaClient, UserStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { demoUsers } from './mock-data'

const prisma = new PrismaClient()

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


