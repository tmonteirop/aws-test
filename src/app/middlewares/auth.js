import prismaClient from '@prisma/client';
import log from 'npmlog';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { PrismaClient } = prismaClient;

const prisma = new PrismaClient({});

export default async (req, res, next) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
        res.status(400).send({
            title: `Erro!`,
            message: `Token não fornecido!`,
        });
        return log.info(`AUTH TOKEN`, `header não possui token`);
    }

    try {
        const [, token] = bearerToken.split(' ');

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

        const { id, username } = decodedToken;

        const findUser = await prisma.user.findFirst({
            where: {
                AND: {
                    id: id,
                    username: username,
                },
            },
        });

        if (!findUser) {
            return res.status(401).send({
                title: `Erro!`,
                message: `Usuário não encontrado!`,
            });
        }
        return next();
    } catch (error) {
        res.status(401).send({
            title: `Erro!`,
            message: `Verifique usuário e senha!`,
        });
        return log.error(`LOGIN ERROR`, `Erro ao logar`);
    }
};
