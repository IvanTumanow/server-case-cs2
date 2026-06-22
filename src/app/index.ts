import {Server} from "./server.js";

import user from '../route/user/user.route.js'
import auth from "../route/auth/auth.route.js";

class AppServer extends Server {
    override route(): void {
        super.route()

        this.app.route('/user', user)

        this.app.route('/auth', auth)
    }
}

const app = new AppServer()

await app.init()