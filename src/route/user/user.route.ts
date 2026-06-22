import {Hono} from "hono";

const user = new Hono().basePath('/')

user.get('/:id', (c) => {
    const id = c.req.param('id')
    return c.text(`User ${id}`, 200)
})

user.post('/', async (c) => {
    return c.json({
    }, 201)
})

export default user;