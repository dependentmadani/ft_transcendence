import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "src/auth/auth.service";


export class WsGuard extends AuthGuard('ws-jwt') {
    constructor() {
        super();
    }

    // constructor(private authService: AuthService,
    //         private jwtService: JwtService) {
    //     super();
    // }

    // async canActivate(context: any): Promise<boolean | any> {
    //     const token = context.args[0].handshake.headers.authorization.split(' ')[1];

    //     try {
    //         const decoded = this.authService.verifyToken(token);
    //         const user = await this.authService.returnUser(decoded['email'])

    //         if (user){
    //             return user;
    //         }
    //         return false;
    //     } catch (ex) {
    //         return false;
    //     }
    // }
}