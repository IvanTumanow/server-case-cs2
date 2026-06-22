import {Hono} from "hono";
import {deleteCookie, getCookie} from 'hono/cookie'
import type {ResponseResult} from "../../shared/types/response-request.types.js";

const user = new Hono().basePath('/')

user.get('/me', async (c) => {
    return c.text('Hello!!!')
})

user.post('/logout', (c) => {
    const cookie = getCookie(c, 'token');

    if (cookie) deleteCookie(c, 'token');
    else {
        return c.json({
            success: false,
            error: {
                details: 'Необходимые данные для выхода не найдены'
            }
        } as ResponseResult, 400)
    }

    return c.json({
        success: true,
        data: 'Выход успешно выполнен'
    } as ResponseResult, 200)
})

user.post('/', async (c) => {
    return c.json({}, 201)
})

export default user;