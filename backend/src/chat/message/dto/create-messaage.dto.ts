import { IsString } from "class-validator";

export class message {

    @IsString()
    chatId: string;

    @IsString()
    senderId: string;

    @IsString()
    text: string

}