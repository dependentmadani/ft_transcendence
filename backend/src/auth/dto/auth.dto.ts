import { IsNotEmpty, IsString } from "class-validator"

export class AuthDto {

    @IsString()
    @IsNotEmpty()
    username: String;

    @IsString()
    @IsNotEmpty()
    password: String;
}