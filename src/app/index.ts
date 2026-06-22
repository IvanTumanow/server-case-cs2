import {Server} from "./server.js";

import user from '../route/user/user.route.js'

class AppServer extends Server {
    override route(): void {
        super.route()

        this.app.route('/user', user)
    }
}

const app = new AppServer()

await app.init()