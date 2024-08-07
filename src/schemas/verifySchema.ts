import {z} from 'zod'

export const verifyValidation = z.object({
    code: z.string().length(6,"Verification code must have 6 digits")
})