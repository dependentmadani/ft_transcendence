import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {UserModify} from './dto/create-users.dto'
import { Users, Chat } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private authService: AuthService, 
        private prisma: PrismaService) {}

    async findAllUsers(): Promise<Users[]> {
        const users = await this.prisma.users.findMany();
        if (!users)
            throw new NotFoundException('The user is not found');
        // console.log(users);
        return users;
    }

    async findUserById(userId: number): Promise<Users> {
        const user = await this.prisma.users.findUnique({
            where: {
                id: userId
            }
        });
        return user;
    }

    async findUserByUsername(username: string): Promise<Users> {
        const user = await this.prisma.users.findUnique({
            where: {
                username: username,
            },
        });
        return user
    }

    async updateUser(userId: number, userInfo: Users, body: UserModify) {
        try {
            const user = await this.prisma.users.update({
                where: {
                    id: userId,
                },
                data: { 
                    username: body?.username,
                    avatar: body?.avatar,
                }
            });
            return user;
        }
        catch {
            throw new UnauthorizedException('username must be unique');
        }
    }

    async deleteUser(userId: number): Promise<void> {
        const user = await this.prisma.users.findUnique({
            where: {
                id: userId,
            }
        })
        if (user)
            await this.prisma.users.delete({
                where: {
                    id: userId
                },
            });
    }

    async uploadAvatar(userId: number, filePath: string) {
        try {
            const user = await this.prisma.users.update({
                where: {
                    id: userId,
                },
                data: {
                    avatar: filePath,
                }
            });
            return user;
        }
        catch {
            throw new UnauthorizedException('userId is wrong somehow! :(');
        }

    }

    async getAvatar(userId:number): Promise<string> {
        try {
            const user = await this.prisma.users.findUnique({
                where: {
                    id: userId,
                },
            });

            return user.avatar;
        }
        catch {
            throw new UnauthorizedException('something wrong with userId! :(');
        }
    }
}
