import z from 'zod'

export const SignupValidator = z.object({
    username:z.string(),
    password:z.string(),
    email:z.string()
})

export const LoginValidator = z.object({
    username:z.string(),
    password:z.string()
})