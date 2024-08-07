import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].ts/authOptions";
import mongoose from "mongoose";

export async function GET() {
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

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const dbUser = await User.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: {
                    'messages.createdAt': -1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    }
                }
            }
        ])
        if(!dbUser || dbUser.length === 0){
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 403
            })
        }
        return Response.json({
            success: true,
            message: "Messages fetched successfully",
            messages: dbUser[0].messages
        },{
            status: 200
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error fetching messages"
        },{
            status: 500
        })
    }
}