import {z} from "zod";

const emailField = z.email({error: 'Введите корректный email'});
const passwordField = z.string({error: 'Поле password обязательно для заполнения'}).min(8, {error: 'Пароль должен содержать минимум 8 символов'});

const authSchema = z.object({
    email: emailField,
    password: passwordField,
})

type AuthUser = z.infer<typeof authSchema>

export {authSchema}

export type { AuthUser }