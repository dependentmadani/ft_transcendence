import { Users } from '@prisma/client';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: Users;
    }
  }
}