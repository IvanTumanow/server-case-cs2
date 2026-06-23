import {Hono} from "hono";
import {deleteCookie} from 'hono/cookie'
import type {ResponseResult} from "@/shared/types/response-request.types.js";
import {useTokenMiddleware} from "@/middleware/use-token.middleware.js";
import type {User} from "@/generated/prisma/client.js";
import {prisma} from "@/config/prisma-connect.config.js";

type Variables = {
    user: User;
}

const user = new Hono<{ Variables: Variables }>().basePath('/')

user.use('*', useTokenMiddleware)

user.get('/me', async (c) => {
    const user = c.get('user')

    return c.json({
        success: true,
        data: user
    } as ResponseResult, 200)
})

user.post('/balance-up', async (c) => {
    const {id: userId} = c.get('user')

    const userAsUpdateBalance: User = await prisma.user.update({
        where: {id: userId},
        data: {
            balance: {
                increment: 1000
            }
        }
    })

    return c.json({
        success: true,
        data: {
            userAsUpdateBalance
        }
    } as ResponseResult, 200)
})

user.post('/logout', async (c) => {
    try {
        deleteCookie(c, 'token', {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
            sameSite: 'Lax'
        });


        return c.json({
            success: true,
            data: 'Выход успешно выполнен'
        } as ResponseResult, 200)
    } catch (error) {
        return c.json({
            success: false,
            error: {
                details: 'Ошибка при выходе'
            }
        } as ResponseResult, 500)
    }
})

export default user;