import 'dotenv/config';
import prisma from '../src/config/client';
import bcrypt from 'bcrypt';

async function main() {
    const email = 'admin@globalmediasports.com'; // Change this if needed
    const newPassword = 'YourNewPassword123!';   // Change this to what you want

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { email },
        data: { password: hashed },
    });

    console.log(`✅ Password updated for ${email}`);
}

main().finally(() => prisma.$disconnect());
