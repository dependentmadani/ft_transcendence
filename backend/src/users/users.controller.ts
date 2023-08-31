import { Body, Controller, Delete, Get,  NotFoundException,  Param,  ParseIntPipe, Patch, Post, Req, Res, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { Authenticated } from 'src/decorator/authenticated.decorator';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { UserModify } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {v4 as uuidv4} from 'uuid'
import * as path from 'path'
import { of } from 'rxjs';
import { join } from 'path';
// import { Public } from '@prisma/client/runtime/library';
import { Public } from "src/decorator";
export const storage = {
    storage : diskStorage({
        destination: './uploads/avatarStorage/',
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
@Controller('users')
@Authenticated()
export class UsersController {
    
    constructor(private userService: UsersService,
        private authService: AuthService,
        private jwtService: JwtService) {}
    
    @Get("")
    getNothing(): Promise<Users[]> {
        return this.userService.findAllUsers();
    }

    @Get('search/:username')
    async searchUser(@Param('username') username: string) {
        return this.userService.searchUser(username);
    }

    @Get("/:id")
    async getUser(@Param("id", ParseIntPipe) userId: number,
     @Req() req: Request): Promise<Users> {
        const currentUser: Users = await this.userService.findUserById(userId);
        if (!currentUser)
            throw new NotFoundException('The user is not available');
        return currentUser;
    }

    @Get('/:id/avatar')
    async getAvatar(@Param('id', ParseIntPipe) userId: number,
        @Res() res) {
        const filenamePath = await this.userService.getAvatar(userId);
        
        return res.sendFile(join(process.cwd(), filenamePath));
    }

    @Post("/:id/avatar")
    @UseInterceptors(FileInterceptor('avatar', storage))
    uploadFile(@Req() req: Request,
        @Param("id", ParseIntPipe) userId: number,
        @UploadedFile() file) {
        
        if (!file) {
            throw new UnauthorizedException('Did not upload successfully');
        }
        return this.userService.uploadAvatar(userId, file.path);
    }

    @Patch("/:id")
    updateUser(@Param("id", ParseIntPipe) userId: number,
        @Req() req: Request,
        @Body() body: UserModify) {

        return this.userService.updateUser(userId, req.user, body);
    }

    @Delete("/:id")
    deleteUser(@Param("id", ParseIntPipe) userId: number) {

        this.userService.deleteUser(userId);
    }

    @Get("/:id/stats")
    getUserStats() {
        return 'the player stats will diplayed soon';
    }

}

//TODO: need to check that username is "unique" in the database when sign up

//TODO: update the user info only if he is the appropriate user info. You can know using decode method of bcrypt.