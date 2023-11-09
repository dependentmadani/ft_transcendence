import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { NotAllowedUserException } from 'src/exception/NotAuthUser.exception';



@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const token = request.cookies['token'];
    
    if (isPublic && !token) return true;
    if (!token) {
      console.log('all seem to be good');
      throw new NotAllowedUserException();
    }
    // Validate the token using the JWT authentication strategy
    request.headers.authorization = `Bearer ${token}`;
    return super.canActivate(context);
  }

}