import {z} from 'zod'

const UserSchemaalidation = z.object({
    username: z.string().min(3),
    password:z.string().min(3)
})

export {UserSchemaalidation}