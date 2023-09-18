import { NotificationType } from "@prisma/client";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class NotificationDto {
    @IsNumber()
    receiverId: number;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    icon: string;

    @IsNotEmpty()
    type: NotificationType;

    @IsBoolean()
    read: boolean;
}
