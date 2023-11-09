import {IsString,
Length
} from 'class-validator';

export class roomCreationName {

    @Length(1, 20)
    @IsString()
    roomName: string;
    
}