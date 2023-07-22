import { Controller } from '@nestjs/common';

@Controller('users')
export class UsersController {}

//TODO: need to check that username is "unique" in the database when sign up