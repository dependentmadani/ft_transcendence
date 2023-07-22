import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) {}
    
    async signup(dto: AuthDto) {
        //need to hash the password for security reasons
        const hash = await argon.hash(dto.password); //check this error

        try {
            const users = await this.prisma.users.create({
            data: {
                username: dto.username,
                password: hash,
                avatar: true,
            },
            // select: {
            //     username: true,
            //     id: true,
            //     avatar: true,
            //     createdAt: true,
            //     updatedAt: true,
            //     chat: true,
            // }, //can be possible user instead of delete users['data'].password
        })
        //the password need to be deleted so it cannot be reached by interder
        delete users.password;
        return users;
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') { 
                    //P2002 means that there is duplicate error launched by prisma
                    throw new ForbiddenException('Credentials taken')
                }
            }
        }
    }

    async signin(dto: AuthDto) {
        const user = await this.prisma.users.findUnique({
            where : {
                username: dto.username
            },
        })

        //did not find the username
        if (!user)
            throw new ForbiddenException('Credentials incorrect');
        
        const passwordChecker = await argon.verify(user.password, dto.password);
        if (!passwordChecker)
            throw new ForbiddenException('Incorrect password');
        
        delete user.password;
        
        return user; 
    }
}