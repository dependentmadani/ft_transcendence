import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) {}

    signin() {
        return {msg: "I am signed in successfully"};
    }

    signup() {
        return {msg: "I am signed up successfully"};
    }
}