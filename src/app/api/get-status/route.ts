import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].ts/authOptions";

export async function GET(){
    await dbConnect()

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

    try {
        const newUser = await User.findById(userId)
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
            message: "User status fetched successfully",
            data: newUser.isAcceptingMessage
        },{
            status: 200
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error fetching status"
        },{
            status: 500
        })
    }
}