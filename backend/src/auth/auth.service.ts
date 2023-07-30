import { ForbiddenException, Injectable, Req, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { ConfigService } from "@nestjs/config";
import { Tokens } from "./types";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService) {}

    hashData(data:string) {
        return bcrypt.hash(data, 10);
    }
    
    async signupLocal(dto: AuthDto): Promise<Tokens> {
        //need to hash the password for security reasons
        const hash = await this.hashData(dto.password); //check this error

        try {
                const users = await this.prisma.users.create({
                data: {
                    username: dto.username,
                    email: dto.email,
                    password: hash,
                },
            })
            //the password need to be deleted so it cannot be reached by interder
            const token = await this.signToken(users.id, users.email);
            await this.updateRtHashed(users.id, token.refresh_token);

            return token;
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

    async signinLocal(dto: AuthDto, tokens?: Tokens): Promise<Tokens> {
        const user = await this.prisma.users.findUnique({
            where : {
                email: dto.email,
            },
        })

        //did not find the username
        if (!user)
            throw new ForbiddenException('Access Denied');
        
        const passwordChecker = await bcrypt.compare(dto.password, user.password);
        if (!passwordChecker)
            throw new ForbiddenException('Access Denied');
        
        delete user.password;
        const token = await this.signToken(user.id, user.email);
        await this.updateRtHashed(user.id, token.refresh_token);
    
        return token; 
    }

    async logout(userId: number) {
        await this.prisma.users.updateMany({
            where: {
                id: userId,
                hashRt: {
                    not: null,
                }
            },
            data : {
                hashRt: null
            }
        });
    }

    async signup42(dto: AuthDto): Promise<Tokens> {
        //need to hash the password for security reasons

        try {
                const users = await this.prisma.users.create({
                data: {
                    username: dto.username,
                    email: dto.email,
                },
            })
            //the password need to be deleted so it cannot be reached by interder
            const token = await this.signToken(users.id, users.email);
            await this.updateRtHashed(users.id, token.refresh_token);

            return token;
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

    async signin42(dto: AuthDto, tokens?: Tokens): Promise<Tokens> {
        const user = await this.prisma.users.findUnique({
            where : {
                email: dto.email,
            },
        })
        //did not find the username
        if (!user)
            throw new ForbiddenException('Access Denied');
        
        delete user.password;
        const token = await this.signToken(user.id, user.email);
        await this.updateRtHashed(user.id, token.refresh_token);
    
        return token; 
    }

    async fortyTwo(profile: any): Promise<Tokens> {
        // console.log(profile);
        const userDto: AuthDto = {
            username: profile.username,
            email: profile.email,
        }
        const available = await this.findUser(profile.username, profile.email);
        if (!available) {
            return this.signup42(userDto);
        }
        return this.signin42(userDto);
    }

    async refreshTokens(userdId: number, rt: string): Promise<Tokens> {
        const user = await this.prisma.users.findUnique({
            where: {
                id: userdId,
            }
        });

        if (!user || !user.hashRt)
            throw new ForbiddenException("Access Denied");
        
        const rtCompare = await bcrypt.compare(rt, user.hashRt);
        if (!rtCompare)
            throw new ForbiddenException("Wrong creddentials");
        
        const token = await this.signToken(user.id, user.email);
        await this.updateRtHashed(user.id, token.refresh_token);

        return token; 
    }
    
    async signToken(userId: number,
        email: string ): Promise<Tokens> {
        const payload = {
            sub: userId,
            email,
        };
        
        const secretAt = this.config.get<string>('JWT_SECRET_AT');
        const secretRt = this.config.get<string>('JWT_SECRET_RT');
    
        const [at, rt] = await Promise.all([
            
            this.jwt.signAsync(payload, {
                secret: secretAt,
                expiresIn: 60 * 15,
            },),
            this.jwt.signAsync(payload, {
                secret: secretRt,
                expiresIn: 60 * 60 * 24 * 7,
            })
        ]);

        return {
            access_token: at,
            refresh_token: rt,
            }
        }


    async findUser(username: string, email:string): Promise<boolean> {
        
        const user = await this.prisma.users.findUnique({
            where : {
                email: email,
            },
        })

        if (!user) {
            return false;
        }
        return true;
    }

    async updateRtHashed(userId: number, hashedRt:string) {
        const hash = await this.hashData(hashedRt);

        await this.prisma.users.update({
            where: {
                id: userId,
            },
            data : {
                hashRt: hash,
            }
        })
    }
    
    // async redirectToFortyTwo(dto: any, strategy: FortyTwoStrategy){
    //         // to authenticate the 42 user, get it from auth controller
    //         console.log(strategy);
    //         // strategy.validate()
            
    //     }
        
    }