import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].ts/authOptions";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user = session?.user

    if(!session || !user){
        return Response.json({
            success: false,
            message: "No session or user found"
        },{
            status: 401
        })
    }

    const userId = user._id
    const {acceptingMessages} = await request.json()

    try {
        const newUser = User.findByIdAndUpdate(userId,{
            isAcceptingMessage: acceptingMessages
        },{
            new: true
        })
        if(!newUser){
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 403
            })
        }
        return Response.json({
            success: true,
            message: "Status updated successfully"
        },{
            status: 200
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error updating status"
        },{
            status: 500
        })
    }
}