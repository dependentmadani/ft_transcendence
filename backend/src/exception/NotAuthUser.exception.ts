import { HttpException, HttpStatus } from "@nestjs/common";

export class NotAllowedUserException extends HttpException {
    constructor() {
        super('The user is not allowed to access', HttpStatus.FORBIDDEN);
    }
}