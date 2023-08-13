import { IsDate, IsInt, IsString } from "class-validator";

export class ChatD {
    
    @IsString()
    text: string

    @IsInt()
    senderId: number

    @IsInt()
    receiverId: number

}