import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user = session?.user

    console.log(request);
    

    if(!session || !user){
        return Response.json({
            success: false,
            message: "No session or user found"
        },{
            status: 401
        })
    }

    const userId = user?._id
    const body = await request.json()
    const {acceptMessages} = body

    console.log(acceptMessages);
    

    try {
        const newUser = await User.findByIdAndUpdate(userId,{
            isAcceptingMessage: acceptMessages
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