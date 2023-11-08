import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length
} from 'class-validator';

export class AuthDto {
  @Length(1, 20)
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
