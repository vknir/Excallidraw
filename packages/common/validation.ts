import {z} from 'zod'

const AuthValidator ={
    username: z.string().min(2).max(15),
    password: z.string().min(3)
}

export {AuthValidator}