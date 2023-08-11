import { IsDate, IsInt } from "class-validator";

export class Chat {

    @IsInt()
    userId: number

}