import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { FortyTwoStrategy } from "../strategy";
import { AtStrategy } from "src/strategy/at.strategy";
import { RtStrategy } from "src/strategy/rt.strategy";

@Module({
    imports: [PassportModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, FortyTwoStrategy, AtStrategy, RtStrategy],
})
export class AuthModule {}