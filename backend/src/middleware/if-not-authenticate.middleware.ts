import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import {
  NextFunction,
  Request,
  Response,
} from 'express';

@Injectable()
export class IfNotAuthenticatedMiddleware
  implements NestMiddleware
{
  use(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const accessToken = req.cookies['token']; // Assuming you store the access token in a cookie
    if (!accessToken) {
      // If access token is not available, redirect to sign-in page
      return res.redirect(
        `http://${process.env.ADDRESS}:8000/auth/42`,
      ); // Adjust the sign-in page URL as per your application
    }
    //TODO: need to adjust the redirection depends on where should go
    // Access token available, continue with the next middleware or request handler
    next();
  }
}
