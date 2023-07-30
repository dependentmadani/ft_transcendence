import {v4 as uuid} from 'uuid'
import { IsString, IsInt, IsUUID, IsDate, IsBoolean } from 'class-validator';

export class users {

    @IsDate()
    createdAt: Date;

    @IsDate()
    updatedAt: Date;

    @IsInt()
    userId: number;

    @IsString()
    username: string;

    @IsString()
    avatar: string;

    @IsString()
    password: string;
    
    @IsString()
    hashedSaltedPassword: string;

    //chat need to be added
}