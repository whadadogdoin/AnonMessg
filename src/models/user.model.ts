import mongoose, { Document, Schema } from "mongoose";

export interface messageInterface extends Document {
    content: string,
    createdAt: Date,
}

const messageSchema : Schema<messageInterface> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
})

export interface userInterface extends Document {
    username: string,
    email: string,
    password: string,
    isVerified: boolean,
    verificationToken?: string,
    verificationTokenExpiry?: Date,
    messages?: [messageInterface],
    isAcceptingMessage: boolean
}

const userSchema: Schema<userInterface> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        required: true,
        default: false
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    messages : [messageSchema]
})

const User = (mongoose.models.User as mongoose.Model<userInterface>) || (mongoose.model<userInterface>("User", userSchema))

export default User

