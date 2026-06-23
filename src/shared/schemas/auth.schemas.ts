import {z} from "zod";

const emailField = z.email({error: 'Введите корректный email'});
const passwordField = z.string({error: 'Поле password обязательно для заполнения'}).min(8, {error: 'Пароль должен содержать минимум 8 символов'});
const idField = z.cuid2({error: 'Поле id не соответствует cuid'})

const authSchema = z.object({
    email: emailField,
    password: passwordField,
})

const tokenPayloadSchema = z.object({
    email: emailField,
    id: idField,
})

type IAuthUser = z.infer<typeof authSchema>
type ITokenPayload = z.infer<typeof tokenPayloadSchema>

export {authSchema, tokenPayloadSchema}

export type { IAuthUser, ITokenPayload }