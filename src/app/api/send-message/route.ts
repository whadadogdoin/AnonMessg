import dbConnect from "@/lib/dbConnect";
import User, { messageInterface } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].ts/authOptions";

export async function POST(request: Request) {
    await dbConnect()

    const {content, username} = await request.json()

    try {
        const user = await User.findOne(username)
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 404
            })
        }
        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "User not accepting messages"
            },{
                status: 403
            })
        }
        
        const message = {
            content,
            createdAt: new Date()
        }

        user.messages?.push(message as messageInterface)

        await user.save()

        return Response.json({
            success: true,
            message: "Message sent successfully"
        },{
            status: 200
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error sending message"
        },{
            status: 500
        })
    }
}