import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) {}
    
    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password); //check this error

        return {};
    }

    signin(dto: AuthDto) {
        return {msg: "I am signed in successfully"};
    }
}