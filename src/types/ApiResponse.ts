import { messageInterface } from "@/models/user.model"

export interface ApiResponse {
    message: string,
    success: boolean,
    isAcceptingMessages?: boolean,
    messages?: [messageInterface]
}