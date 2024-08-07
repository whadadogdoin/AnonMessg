import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { sendEmail } from "@/utils/sendEmail";
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username,email,password} = await request.json()

        const existingUserByUsername = await User.findOne({
            username,
            isVerified: true
        })

        if(existingUserByUsername){
            return Response.json({
                success: false,
                message: "Username not available"
            },{
                status: 400
            })
        }

        const existingUserByEmail = await User.findOne({email})

        const verifyCode = Math.floor(Math.random()*900000 + 100000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User with given email already exists"
                },{
                    status: 400
                })
            } else{
                const salt = await bcrypt.genSalt(10)
                existingUserByEmail.password = await bcrypt.hash(password,salt)
                existingUserByEmail.verificationToken = verifyCode
                existingUserByEmail.verificationTokenExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save();
            }
        } else{
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)
            const newUser = new User({
                email,
                username,
                password: hashedPassword,
                verificationToken: verifyCode,
                verificationTokenExpiry: new Date(Date.now() + 3600000),
                isVerified: false,
                isAcceptingMessage: false,
                messages: []
            })

            await newUser.save()
        }

        const emailResponse = await sendEmail({
            username,
            email,
            verificationToken: verifyCode
        })

        if (!emailResponse.success) {
            return Response.json(
              {
                success: false,
                message: emailResponse.message,
              },
              { status: 500 }
            );
        }
      
        return Response.json(
            {
              success: true,
              message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error registering user: ", error)
        return Response.json({
            status: false,
            message: "Error registering user"
        },{
            status: 500
        })
    }
}