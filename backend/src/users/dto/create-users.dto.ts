import {v4 as uuid} from 'uuid'
import { IsString, IsInt, IsUUID } from 'class-validator';

export class users {
    @IsInt()
    userId: number;

    @IsString()
    username: string;

    @IsString()
    avatar:string;

    @IsUUID()
    password: uuid;
    
    @IsUUID()
    hashedSaltedPassword: uuid;
}