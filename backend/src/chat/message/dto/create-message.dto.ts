import { IsString, IsInt } from "class-validator";

export class Message {

    @IsInt()
    messageId: number;

    @IsInt()
    senderId: number;

    @IsString()
    text: string

}