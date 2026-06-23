import { createMiddleware } from 'hono/factory'
import {getCookie} from "hono/cookie";
import jwt from "jsonwebtoken";
import {ENV_CONFIG} from "@/config/env.config.js";
import {prisma} from "@/config/prisma-connect.config.js";
import {tokenPayloadSchema} from "@/shared/schemas/auth.schemas.js";
import type {ResponseResult} from "@/shared/types/response-request.types.js";

export const useTokenMiddleware = createMiddleware(async (c, next) => {
    const cookie = getCookie(c, 'token')

    if (!cookie) return c.json({success: false, error: { details: 'Cookie не найдены' }} as ResponseResult, 401)

    try{
        const decodedTokenValidation = await tokenPayloadSchema.safeParseAsync(jwt.verify(cookie, ENV_CONFIG.KEY.JWT_SECRET))

        if (!decodedTokenValidation.success) return c.json({success: false, error: { details: 'Невалидный формат токена' }} as ResponseResult, 403)

        const user = await prisma.user.findUnique({where: {id: decodedTokenValidation.data.id}})

        if (!user) return c.json({success: false, error: { details: 'Пользователь не найден' }} as ResponseResult, 404)

        c.set('user', user)

        await next()
    }
    catch(err) {
        if (err instanceof jwt.JsonWebTokenError) return c.json({success: false, error: {details: 'Токен неверен или просрочен'}} as ResponseResult, 403)

        return c.json({success: false, error: {details: err}} as ResponseResult, 403)
    }
})