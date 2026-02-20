
import 'dotenv/config';
import prisma from '../src/config/client';

async function main() {
    const email = 'priyansh@mail.com'; // Hardcoded for this specific user request
    console.log(`Searching for user with email: ${email}...`);

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.error('User not found!');
            return;
        }

        console.log(`Found user: ${user.id}. Current status: ${user.subscriptionStatus}`);

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { subscriptionStatus: 'ACTIVE' },
        });

        console.log('Successfully updated subscription status to ACTIVE');
        console.log('Updated User:', updatedUser);
    } catch (e) {
        console.error('Error updating user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
