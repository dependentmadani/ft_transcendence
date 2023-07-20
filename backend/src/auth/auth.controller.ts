import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signin')
    signin() {
        return this.authService.signin();
    }

    @Post('signup')
    signup() {
        return this.authService.signup();
    }
}