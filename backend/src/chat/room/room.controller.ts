import { Body, Controller, Get, Param, ParseIntPipe, Post, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from '@prisma/client'
import { Public } from "src/decorator";
import { diskStorage } from 'multer';
import path from 'path';
import {v4 as uuidv4} from 'uuid'
import { FileInterceptor } from '@nestjs/platform-express';

export const storage = {
    storage : diskStorage({
        destination: './uploads/',
        filename : (req, file, cb) => {
            
            if (!path)
            return ;
        const filename: string = path?.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
        const extension: string = path?.parse(file.originalname).ext;
        
        cb(null, `${filename}${extension}`);
    }
})
};

@Public()
@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Get()
    async getRooms(): Promise<Room[]> {
        return this.roomService.getRooms()
    }

    // @Post()
    // @UseInterceptors(FileInterceptor('roomAvatar', storage))
    // async createRoom(@Body('roomName') roomName: string,
    //                     @UploadedFile() file,
    //                     @Body('roomUser') roomUser: number,
    //                     @Body('role') role: string) {
    //     if (!file) {
    //         throw new UnauthorizedException('Did not upload successfully');
    //     }
    //     return this.roomService.createRoom(roomName, file.path, roomUser, role)
    // }

    @Post()
    @UseInterceptors(FileInterceptor('roomAvatar', storage))
    createRoom(@Body("roomName") roomName: string,
        @UploadedFile() file,
        @Body("roomUsers", ParseIntPipe) roomUsers: number,
        @Body("role") role: string,) {
        
        console.log('PATH', file)
        if (!file) {
            throw new UnauthorizedException('Did not upload successfully');
        }
        return this.roomService.createRoom(roomName, file.path, roomUsers,role);
    }
}
