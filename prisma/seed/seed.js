import pkg from '@prisma/client';

const {PrismaClient} = pkg;

import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password_hash = await bcrypt.hash('username', 10);

    const user = await prisma.user.create({
        data: {
            name: 'user',
            username: 'username',
            email: 'username@email.com',
            password: password_hash,
        },
    });

    console.log(user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
