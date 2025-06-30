// scripts/create-super-admin.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10); // password: 123456

  const admin = await prisma.user.upsert({
    where: { email: 'superadmin@mail.com' },
    update: {},
    create: {
      email: 'superadmin@mail.com',
      username: 'superadmin',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log('✅ Super admin created:', admin);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
