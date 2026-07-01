import {Hono} from "hono";
import {deleteCookie} from 'hono/cookie'
import type {ResponseResult} from "@/shared/types/response-request.types.js";
import {useTokenMiddleware} from "@/middleware/use-token.middleware.js";
import type {User} from "@/generated/prisma/client.js";
import {prisma} from "@/config/prisma-connect.config.js";
import {BALANCE_CONFIG} from "@/config/balance.config.js";

type Variables = {
    user: User;
}

const user = new Hono<{ Variables: Variables }>().basePath('/')

user.use('*', useTokenMiddleware)

user.get('/me', async (c) => {
    const user = c.get('user')

    return c.json({
        success: true,
        data: {user}
    } as ResponseResult, 200)
})

user.post('/me/balance-up', async (c) => {
    const {id: userId} = c.get('user')

    const user: Pick<User, 'lastPayoutDate'> = await prisma.user.findUniqueOrThrow({
        where: {id: userId},
        select: {lastPayoutDate: true}
    })

    const now = new Date(Date.now())
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (user.lastPayoutDate === null || user.lastPayoutDate < today) {
        const userAsUpdateBalance: User = await prisma.user.update({
            where: {id: userId},
            data: {
                lastPayoutDate: today,
                balance: {
                    increment: BALANCE_CONFIG.ONE_TIME_PAID_TOTAL
                }
            }
        })

        return c.json({
            success: true,
            data: {
                user: userAsUpdateBalance,
                balance: {
                    totalPaid: BALANCE_CONFIG.ONE_TIME_PAID_TOTAL
                }
            }
        } as ResponseResult, 200)
    }

    throw new Error('Баланс сегодня уже был пополнен')
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