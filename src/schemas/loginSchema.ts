import {z} from 'zod'

export const signupValidation = z.object({
    identifier: z.string(),
    password: z.string()
})