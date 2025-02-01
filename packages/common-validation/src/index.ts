import z from 'zod'

export const SignUpValidator= z.object({
    username:z.string(),
    password:z.string().min(3),
    email:z.string().email()
})

export const LoginValidator = z.object({
    username:z.string(),
    password:z.string().min(3),
})