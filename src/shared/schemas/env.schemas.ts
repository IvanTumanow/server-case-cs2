import {z} from "zod";

const envSchema = z.object({
    CLIENT_URL: z.url(),
    DATABASE_URL: z.string()
})

type EnvKey = z.infer<typeof envSchema>

export {envSchema}

export type { EnvKey }