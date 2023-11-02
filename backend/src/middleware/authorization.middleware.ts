import { Injectable, NestMiddleware } from '@nestjs/common';
import { request } from 'express';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Set the authorization header in the request
    if (request.user) {
      req.headers.authorization = `Bearer ${request.user['token']}`;
      next();
    }
  }
}
