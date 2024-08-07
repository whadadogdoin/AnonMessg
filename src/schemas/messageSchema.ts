import {z} from 'zod'

export const messageValidation = z.object({
    content: z.string().min(1,"Message can not be empty").max(300,"Character limit exceeded i.e. 300")
})