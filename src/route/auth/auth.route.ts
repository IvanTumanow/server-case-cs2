import {Hono} from "hono";
import {authSchema, type AuthUser} from "../../shared/schemas/auth.schemas.js";
import type {ResponseResult} from "../../shared/types/response-request.types.js";
import {prisma} from "../../config/prisma-connect.config.js";
import type {User} from "../../generated/prisma/client.js";
import {compare, hash} from 'bcrypt'
import jwt from "jsonwebtoken";
import {ENV_CONFIG} from "../../config/env.config.js";
import {setCookie} from 'hono/cookie'

const auth = new Hono().basePath('/')

function generateAccessToken(id: User['id'], email: User['email']): string {
    const payload = {id, email};
    return jwt.sign(payload, ENV_CONFIG.KEY.JWT_SECRET, {expiresIn: "24h"});
}

auth.post('/login', async (c) => {
    const body = await c.req.json()

    const validation = await authSchema.safeParseAsync(body)

    if (!validation.success) {
        return c.json({
            success: false,
            error: {
                details: validation.error.issues.map(e => e.message.trim())
            }
        } as ResponseResult, 400)
    }

    const verifiedUser = await prisma.user.findUnique({where: {email: validation.data.email}})

    if (!verifiedUser) {
        return c.json({
            success: false,
            error: {
                details: 'Пользователь с таким email не найден'
            }
        } as ResponseResult, 400)
    }


    const isPasswordMatch = await compare(validation.data.password, verifiedUser.password)

    if (!isPasswordMatch) {
        return c.json({
            success: false,
            error: {
                details: 'Пароль введен неверно'
            }
        } as ResponseResult, 400)
    }

    const token: string = generateAccessToken(verifiedUser.id, verifiedUser.email)

    setCookie(c, 'token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'Lax'
    })


    type UserAuthorized = Pick<User, 'createdAt' | 'email' | 'id' | 'updatedAt'>
    const {createdAt, email, id, updatedAt} = verifiedUser

    return c.json({
        success: true,
        data: {email, id, createdAt, updatedAt,}
    } as ResponseResult<UserAuthorized>, 200)
})

auth.post('/register', async (c) => {
    const body = await c.req.json()

    const validation = await authSchema.safeParseAsync(body)

    if (!validation.success) {
        return c.json({
            success: false,
            error: {
                details: validation.error.issues.map(e => e.message.trim())
            }
        } as ResponseResult, 400)
    }

    const verifiedUser = await prisma.user.findUnique({where: {email: validation.data.email}})

    if (verifiedUser) {
        return c.json({
            success: false,
            error: {
                details: 'Пользователь с таким email уже существует'
            }
        } as ResponseResult, 400)
    }

    const hashPassword = await hash(validation.data.password, 5)

    type UserCreated = Pick<User, 'createdAt' | 'email' | 'id' | 'updatedAt'>
    const user: UserCreated = await prisma.user.create({
        data: {
            ...validation.data,
            password: hashPassword
        },
        select: {
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        }
    })

    return c.json({
        success: true,
        data: user
    } as ResponseResult<UserCreated>, 201)
})

export default auth;