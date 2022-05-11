import bcrypt from 'bcryptjs';

import prismaClient from '@prisma/client';

const { PrismaClient } = prismaClient;

const prisma = new PrismaClient({});

class UserController {
    async index(req, res) {
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                createdAt: true,
                name: true,
                username: true,
                email: true,
            },
        });

        return res.send(allUsers);
    }

    async show(req, res) {
        const userId = parseInt(req.params.id);

        const user = await prisma.user.findUnique({
            where: {id: userId},
        });

        return res.send(user);
    }

    async store(req, res) {
        const { name, username, email, password } = req.body;

        const userAlreadyExists = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        name: name,
                    },
                    {
                        username: username,
                    },
                    {
                        email: email,
                    },
                ],
            },
        });

        if (userAlreadyExists) {
            return res.send('Usuário já cadastrado');
        }

        const password_hash = await bcrypt.hash(password, 10);

        const createNewUser = await prisma.user.create({
            data: {
                name,
                username,
                email,
                password: password_hash,
            },
        });

        if (createNewUser) {
            return res.send({ createNewUser });
        } else {
            return res.send(`Erro ao cadastrar usuário`);
        }
    }
}

export default new UserController();
