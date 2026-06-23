import {type EnvKey, envSchema} from "@/shared/schemas/env.schemas.js";

class envConfig {
    KEY: EnvKey;

    constructor() {
        const result = envSchema.safeParse(process.env)

        if (!result.success) {
            throw new Error(`Error parsing env config: ${result.error}`)
        }

        this.KEY = result.data
    }
}

export const ENV_CONFIG = new envConfig()