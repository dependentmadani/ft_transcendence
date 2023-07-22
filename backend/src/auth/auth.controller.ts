import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { AuthDto } from "./dto";

// TODO: add this installation for password incryption in the laptop: $ npm install -g node-gyp
// $ CXX=g++-12 npm install argon2

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }
}