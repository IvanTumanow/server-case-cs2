import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { logger } from 'hono/logger'
import { methodOverride } from 'hono/method-override'
import { cors } from 'hono/cors'
import type {ResponseResult} from "@/shared/types/response-request.types.js";

export class Server {
    protected readonly app: Hono
    protected readonly port: number

    constructor(port: number = 8888) {
        this.app = new Hono()
        this.port = port
    }

    protected middleware() {
        this.app.use('*', cors({
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true,
            maxAge: 86400
        }))

        this.app.use('*', compress({ encoding: 'gzip' }))

        this.app.use('*', logger())

        this.app.use('*', methodOverride({app: this.app}))

        this.app.notFound((c) => {
            const res: ResponseResult = {
                success: false,
                error: {
                    details: 'Route not found',
                }
            }
            return c.json(res, 404)
        })

        this.app.onError((err, c) => {
            console.error(`${err}`)
            return c.json(
                {
                    success: false,
                    error: {details: err.message || 'Internal Server Error'}
                } as ResponseResult,
                500
            )
        })
    }

    protected route() {
        this.app.get('/', (c) => {
            return c.json({ message: 'Hello world!'}, 200)
        })
    }

    async init() {
        this.middleware()
        this.route()

        const server = serve({
            fetch: this.app.fetch,
            port: this.port,
        }, (info) => {
            console.log(`🚀 Server is running on http://localhost:${info.port}`)
        })

        process.on('SIGTERM', () => {
            console.log('Shutting down...')
            server.close()
        })
    }
}