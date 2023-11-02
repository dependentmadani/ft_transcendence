import { NotificationType } from "@prisma/client";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class NotificationDto {
    @IsString()
    receiverName: string;

    @IsString()
    title: string;

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

export class FriendDto {
    @IsNumber()
    senderId: number;

    @IsNumber()
    receiverId: number;

    @IsNumber()
    notifId: number;
}