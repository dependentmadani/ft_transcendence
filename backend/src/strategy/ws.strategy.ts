import { Global, Injectable } from "@nestjs/common"; 
import { ConfigService } from "@nestjs/config"; 
import { PassportStrategy } from "@nestjs/passport"; 
import { Strategy , ExtractJwt} from "passport-jwt";
  
 @Global() 
 @Injectable() 
 export class webSocketJwtStrategy extends PassportStrategy (Strategy, 'ws-jwt'){ 
     constructor(private configService: ConfigService){ 
  
         super({ 
             jwtFromRequest: ExtractJwt.fromExtractors([(request: any) => {
                 return request.handshake.headers.authorization.split(' ')[1]; 
             }]), 
             secretOrKey: configService.get('JWT_SECRET_AT'), 
         }) 
     } 
     async validate(payload: any){ 
         return (payload); 
     } 
 }