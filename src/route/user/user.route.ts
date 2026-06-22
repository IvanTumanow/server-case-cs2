import {Hono} from "hono";

const user = new Hono().basePath('/')

user.get('/:id', (c) => {
    const id = c.req.param('id')
    return c.text(`User ${id}`, 200)
})

user.post('/', (c) => {
    return c.text('User created successfully.', 201)
})

export default user;