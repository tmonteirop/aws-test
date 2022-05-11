import prismaClient from '@prisma/client';
import log from 'npmlog';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { PrismaClient } = prismaClient;

const prisma = new PrismaClient({});

const expiresIn = '1 day';

class LoginController {
    async auth(req, res) {
        const { username, password } = req.body;

        try {
            const findUser = await prisma.user.findUnique({
                where: {
                    username: username,
                },
            });

            const isValid = bcrypt.compareSync(password, findUser.password);

            if (!findUser || !isValid) {
                return res.status(401).send({
                    title: `Erro!`,
                    message: `Usuário ou senha inválidos!`,
                });
            }

            const validateUser = {
                auth: true,
                name: findUser.name,
                username: findUser.username,
                token: jwt.sign(
                    { userId: findUser.id, username: findUser.username },
                    process.env.TOKEN_SECRET,
                    {
                        expiresIn,
                    }
                ),
            };

            return res.send(validateUser);
        } catch (error) {
            res.status(500).send({
                title: `Erro!`,
                message: `Erro ao validar usuário!`,
            });
            return log.error(
                `ERROR LOGIN`,
                `Erro ao validar usuário: ${error}`
            );
        }
    }
}

export default new LoginController();
