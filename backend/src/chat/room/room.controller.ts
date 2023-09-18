import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room, Users } from '@prisma/client'
import { Public } from "src/decorator";
import { diskStorage } from 'multer';
import * as path from 'path'
import {v4 as uuidv4} from 'uuid'
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Get()
    async getRooms(): Promise<Room[]> {
        return this.roomService.getRooms()
    }

    @Get('/:roomId')
    async getRoomAdmin(@Param('roomId', ParseIntPipe) roomId: number): Promise<Room> {
        return this.roomService.getOneRoom(roomId)
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('roomAvatar', {
            storage: diskStorage({
                destination: './uploads/roomAvatarStorage/',
                filename : (req, file, cb) => {
                
                if (!path)
                    return ;
            const filename: string = path?.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path?.parse(file.originalname).ext;
            
            cb(null, `${filename}${extension}`);
            }
        }),
        }),
    )
    createRoom(@Body('roomName') roomName: string,
                @UploadedFile() roomAvatar: Express.Multer.File,
                @Body('roomType') roomType: string) {
        return this.roomService.createRoom(roomName, roomAvatar.path, roomType)
    }

    @Patch('/:roomId')
    @UseInterceptors(
        FileInterceptor('roomAvatar', {
            storage: diskStorage({
                destination: './uploads/roomAvatarStorage/',
                filename : (req, file, cb) => {
                
                if (!path)
                    return ;
            const filename: string = path?.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path?.parse(file.originalname).ext;
            
            cb(null, `${filename}${extension}`);
            }
        }),
        }),
    )
    async updateRoom(@Param('roomId', ParseIntPipe) roomId: number,
                    @Body('roomName') roomName: string,
                    @UploadedFile() roomAvatar: Express.Multer.File,
                    @Body('roomType') roomType: string) {
        return await this.roomService.updateRoom(roomId, roomName, roomAvatar.path, roomType)
    }

    @Delete()
    async deleteAllRooms() {
        return this.roomService.deleteAllRooms()
    }
    
    @Delete('/:roomId')
    async deleteRoom(@Param('roomId', ParseIntPipe) roomId: number) {
        return this.roomService.deleteOneRoom(roomId)
    }
}
