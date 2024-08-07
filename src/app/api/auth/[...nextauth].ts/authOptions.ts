import User from "@/models/user.model"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { text } from "stream/consumers"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({

            id: "credentials",
            name: "Credentials",

            credentials: {
                identifier: {label: "Username or Email", type: "text", placeholder: "username or email"},
                password: {label: "Password", type: "Password"}
            },
            async authorize(credentials: any) : Promise<any> {
                await dbConnect();
                try {
                    const user = await User.findOne(
                        {
                            $or: [{username: credentials?.identifier, email: credentials?.identifier}]
                        }
                    )
                    if(!user){
                        throw new Error("Invalid Credentials")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account before signing in")
                    }
                    const verifiyPassword = await bcrypt.compare(credentials?.password,user.password)
                    if(!verifiyPassword){
                        throw new Error("Incorrect Password")
                    }
                    return user
                } catch (error:any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString(),
                token.username = user.username,
                token.isAcceptingMessage = user.isAcceptingMessage,
                token.isVerified = user.isVerified
            }
            return token
        },
        async session({session,token}){
            if(token){
                session.user._id = token._id,
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session
        }
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/signin'
    }
}
