import {z} from 'zod'

export const usernameSchema = z
    .string()
    .min(3,"Username must have atleast three characters")
    .max(20,"Username can not have more than 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/,"Username can not have any special characters")


export const signupSchema = z.object({
    username: usernameSchema,
    email: z.
            string()
            .email("Invalid emaill address"),
    password: z
                .string()
                .min(8,"Password must be atleast 8 characters long")
                .max(30,"Passsword can not have more than 30 characters")
})