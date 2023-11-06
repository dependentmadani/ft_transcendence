import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, Res, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room, Users } from '@prisma/client'
import { Public } from "src/decorator";
import { diskStorage } from 'multer';
import * as path from 'path'
import { Response } from 'express'
import {v4 as uuidv4} from 'uuid'
import { FileInterceptor } from '@nestjs/platform-express';

// export const storage = {
//   storage: diskStorage({
//     destination:
//     `${process.cwd()}/frontend/public/uploadAvatar/`,
//     filename: (req, file, cb) => {
//       //console.log(`${process.cwd()}/frontend/public/uploadAvatar/`)
//       if (!path) return;
//       const filename: string =
//         path
//           ?.parse(file.originalname)
//           .name.replace(/\s/g, '') + uuidv4();
//       const extension: string = path?.parse(
//         file.originalname,
//       ).ext;

//       cb(null, `${filename}${extension}`);
//     },
//   }),
// };

interface FileParams {
  fileName: string
}

export const storage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    },
  }),
};

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

    @Get('roomAvatar/:id')
    async getRoomAvatar(@Param('id', ParseIntPipe) id: number, @Res() res) {
      const fileName = await this.roomService.getRoomAvatar(id)
      return res.sendFile(path.join(__dirname,'../../../uploads/',fileName))
    }

    @Post()
    @UseInterceptors(FileInterceptor('roomAvatar', storage))
    createRoom(@Body('roomName') roomName: string,
                @UploadedFile() file: Express.Multer.File,
                @Body('roomType') roomType: string,
                @Body('roomPass') roomPass: string) {
        return this.roomService.createRoom(roomName, file.filename, roomType, roomPass)
    }

    @Post('pass/:id')
    async checkRoomAccess(@Param('id', ParseIntPipe) roomId: number, @Body('roomPass') roomPass: string): Promise<boolean> {
        return this.roomService.checkRoomAccess(roomId, roomPass)
    }

    @Patch('/:roomId')
    @UseInterceptors(FileInterceptor('roomAvatar', storage))
    async updateRoom(@Param('roomId', ParseIntPipe) roomId: number,
                    @Body('roomName') roomName: string,
                    @UploadedFile() file,
                    @Body('roomType') roomType: string,
                    @Body('roomPass') roomPass: string) {
        return await this.roomService.updateRoom(roomId, roomName, file.filename, roomType, roomPass)
    }

    @Put('/last-message/:id')
    async updateLastMessage(@Param('id', ParseIntPipe) id: number, @Body('content') content: string) {
        return await this.roomService.updateLastMessage(id, content)
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
