import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password?: string;

    @IsString()
    @IsEmail()
    email: string;
}

export class TwoFaAuthDto {
    @IsString()
    @IsEmail()
    email: string;
}

export class TwoFaCodeDto {
    @IsString()
    @IsNotEmpty()
    code: string;
}