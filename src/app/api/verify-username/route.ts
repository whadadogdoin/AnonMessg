import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { usernameSchema } from "@/schemas/signupSchema";
import {z} from "zod"

const usernameQuerySchema = z.object({
    username: usernameSchema,
})

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username} = await request.json()
        const queryParams = {
            username
        }
        const result = usernameQuerySchema.safeParse(queryParams)
        if(!result.success){
            const errorStack = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: errorStack?.length > 0 ? errorStack.join(" , ") : "Invalid Query Parameters"
            },{
                status: 400
            })
        }
        const user = await User.findOne({
            username,
            isVerified: true
        })
        if(user){
            return Response.json({
                success: false,
                message: "Username not unique"
            },{
                status: 200
            })
        }
        return Response.json({
            success: true,
            message: "Username unique"
        },{
            status: 200
        })
    } catch (error) {
        console.log("Error validating username",error)
        return Response.json({
            success: false,
            message: "Error verifying username"
        },{
            status: 500
        })
    }
}