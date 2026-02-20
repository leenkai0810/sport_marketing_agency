import 'dotenv/config';
import prisma from '../src/config/client';
import bcrypt from 'bcrypt';

async function main() {
    const email = 'admin@globalmediasports.com';
    const password = 'Admin@1234';
    const name = 'Admin';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log('Admin user already exists:', existing.email);
        return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
        data: {
            email,
            password: hashed,
            name,
            role: 'ADMIN',
            subscriptionStatus: 'ACTIVE',
            contractAccepted: true,
            contractAcceptedAt: new Date(),
        },
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password:', password);
}

main().finally(() => prisma.$disconnect());
