import { NotificationType } from "@prisma/client";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class NotificationDto {
    @IsNumber()
    receiverName: string;

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

export class NotificationBody {
    @IsNumber()
    NotificationId: number;

    @IsString()
    senderName: string;

    @IsString()
    receiverName: string;

    @IsString()
    title: string;
}