import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Authenticated } from 'src/decorator/authenticated.decorator';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';
import { Users } from '@prisma/client';
import { UserModify } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { join } from 'path';

export const storage = {
  storage: diskStorage({
    destination:
      `${process.cwd()}/../frontEnd/public/uploadAvatar/`,
    filename: (req, file, cb) => {
      if (!path) return;
      const filename: string =
        path
          ?.parse(file.originalname)
          .name.replace(/\s/g, '') + uuidv4();
      const extension: string = path?.parse(
        file.originalname,
      ).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('users')
@Authenticated()
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('')
  getNothing(): Promise<Users[]> {
    return this.userService.findAllUsers();
  }

  @Get('me')
  async getMe(
    @Req() req: Request,
    ): Promise<Users> {
      const user: Users =
      await this.userService.findUserById(
        req.user['sub'],
        );
        return user;
  }

  @Get('achievements')
  async UserAchievements(@Req() req: Request) {
    
  }

  @Post('add-friend/:id')
  @HttpCode(HttpStatus.CREATED)
  async addFriend(@Param('id', ParseIntPipe) friendId: number,
    @Req() req: Request,
    @Res() res: Response)  {
      const user = await this.userService.findUserById(req.user['sub']);
      const friend = await this.userService.addFriend(user.id, friendId);
      // return res.send(friend);
      return friend
    }

  @Post('block-friend/:id')
  @HttpCode(HttpStatus.OK)
  async blockFriend(@Param('id', ParseIntPipe) friendId: number,
    @Req() req:Request,
    @Res() res:Response) {
    const user = await this.userService.findUserById(req.user['sub']);
    const blockedFriend = await this.userService.blockFriend(user.id, friendId);
    return res.send(blockedFriend);
  }

  @Post('unblock-friend/:id')
  @HttpCode(HttpStatus.OK)
  async unblockFriend(@Param('id', ParseIntPipe) friendId: number,
  @Req() req:Request,
  @Res() res: Response) {
    const user = await this.userService.findUserById(req.user['sub']);
    const unblock = await this.userService.unblockFriend(user.id, friendId);
    return res.send(unblock);
  }

  @Get('mutual-friends/:id')
  @HttpCode(HttpStatus.OK)
  async mutualFriends(@Param('id', ParseIntPipe) friendId: number,
  @Req() req:Request,
  @Res() res: Response) {
    const user = await this.userService.findUserById(req.user['sub']);
    const mutual = await this.userService.mutualFriends(user.id, friendId);
    return res.send(mutual);
  }

  @Get('globalSearch/:username')
  @HttpCode(HttpStatus.OK)
  async searchAnyUser(@Param('username') username: string, @Req() req: Request) {
    return this.userService.searchUser(username, req.user);
  }

  @Get('search/:username')
  @HttpCode(HttpStatus.OK)
  async searchUser(@Param('username') username: string, @Req() req: Request) {
    return this.userService.searchFriendUser(username, req.user);
  }

  @Get('search/:friendName/:username')
  @HttpCode(HttpStatus.OK)
  async searchFriendUsers(@Param('friendName') friendName: string,
        @Param('username') username: string, 
        @Req() req: Request) {
    const friendUser = await this.userService.findUserByUsername(friendName);
    return this.userService.searchFriendUser(username, friendUser);
  }

  @Get('/:id')
  async getUser(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Users> {
    const currentUser: Users =
      await this.userService.findUserById(userId);
    if (!currentUser)
      throw new NotFoundException(
        'The user is not available',
      );
    return currentUser;
  }

  @Get('/:id/avatar')
  async getAvatar(
    @Param('id', ParseIntPipe) userId: number,
    @Res() res,
  ) {
    const filenamePath =
      await this.userService.getAvatar(userId);

    return res.sendFile(
      join(process.cwd(), filenamePath),
    );
  }

  @Get('blocked-friend/:id')
  @HttpCode(HttpStatus.OK)
  async checkBlockedFriend(@Param('id', ParseIntPipe) friendId: number,
    @Req() req: Request) {
      const user = await this.userService.findUserById(req.user['sub']);
      return await this.userService.checkBlockedFriend(req.user['sub'], friendId);
  }

  @Get('friend-friends/:id')
  async myFriendFriends(@Param('id', ParseIntPipe) friendId: number,
    @Req() req: Request) {
      const user = await this.userService.findUserById(req.user['sub']);
      return await this.userService.friendFriends(user.id, friendId);
  }

  @Post('/:id/infos')
  @UseInterceptors(
    FileInterceptor('avatar', storage),
  )
  async uploadFile(
    @Req() req: Request,
    @Param('id', ParseIntPipe) userId: number,
    @UploadedFile() file,
  ) {
    if (!file) {
      console.log(process.cwd());
      throw new UnauthorizedException(
        'Did not upload successfully',
        );
      }
    
    return await this.userService.uploadAvatar(
      userId,
      file.filename,
    );
  
  }

  @Patch('/:id')
  async updateUser(
    @Req() req: Request,
    @Body() username: UserModify,
  ) {
    console.log('daz mn hna');
    const user: Users =
      await this.authService.returnUser(
        req.user['email'],
      );
    return await this.userService.updateUser(
      req.user['sub'],
      user,
      username,
    );
  }

  @Delete('/:id')
  async deleteUser(
    @Param('id', ParseIntPipe) userId: number,
  ) {
    await this.userService.deleteUser(userId);
  }

  @Get('/:id/stats')
  getUserStats() {
    return 'the player stats will diplayed soon';
  }
}

//TODO: need to check that username is "unique" in the database when sign up

//TODO: update the user info only if he is the appropriate user info. You can know using decode method of bcrypt.
