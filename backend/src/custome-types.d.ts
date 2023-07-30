import { Users } from '@prisma/client';
import { Request } from 'express';
// import { Users } from 'e'; // Replace with the correct path to your user entity

declare global {
  namespace Express {
    interface Request {
      user: Users; // Replace 'User' with your user entity type
    }
  }
}