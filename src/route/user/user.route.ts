import {Hono} from "hono";
import {deleteCookie, getCookie} from 'hono/cookie'
import type {ResponseResult} from "../../shared/types/response-request.types.js";

const user = new Hono().basePath('/')

user.get('/me', async (c) => {
    if (getCookie(c, 'token')) {
        return c.text('Hello!!!')
    }

    console.log('token', getCookie(c, 'token'));

    return c.text('Unavailable!', 403)
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

user.post('/', async (c) => {
    return c.json({}, 201)
})

export default user;