import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username, code} = await request.json()

        const user = await User.findOne({
            username
        })
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 500
            })
        }
        const validCode = code === user.verificationToken
        const isCodeNotExpired = new Date(user.verificationTokenExpiry!) > new Date()
        if(validCode && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "User verified"
            },{
                status: 200
            })  
        } else if(validCode && !isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification Code Expired"
            },{
                status: 400
            })
        } else {
            return Response.json({
                success: false,
                message: "Verification Code Incorrect"
            },{
                status: 400
            })
        }
    } catch (error) {
        console.log("Error validating user",error)
        return Response.json({
            success: false,
            message: "Error verifying user"
        },{
            status: 500
        })
    }
}