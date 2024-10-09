import {z} from 'zod'

export const loginValidation = z.object({
    identifier: z.string(),
    password: z.string().min(6).trim()
})