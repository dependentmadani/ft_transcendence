import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NotificationBody, NotificationDto } from './dto/create-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Users } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: NotificationDto, userId: number, socketId: string) {
    // console.log('the user id is:', createNotificationDto);
    const receiverInfo = await this.prisma.users.findUnique({
      where: {
        username: createNotificationDto.receiverName
      }
    })
    if (userId == receiverInfo.id) {
      throw new UnauthorizedException("Cannot send add friend request to yourself!");
    }
    const alreadyFriend = await this.prisma.users.findFirst({
      where: {
        id: userId,
        friends: {
          some: {
            id: receiverInfo.id,
          }
        }
      }
    });
    if (alreadyFriend) {
      throw new UnauthorizedException("already friends!");
    }
    const createNotif = await this.prisma.notifications.create({
      data: {
        title: createNotificationDto.title,
        type: createNotificationDto.type,
        socketId: socketId,
        receiverId: receiverInfo.id,
        senderId: userId
      },
    });
    const updatedUser = await this.prisma.users.update({
      where: {
        id: receiverInfo.id,
      },
      data: {
        recNotification: {
          connect: {
            id: createNotif.id,
          }
        }
      },
      include: {
        recNotification: true,
      }
    });
    await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        senNotification: {
          connect: {
            id: createNotif.id,
          }
        }
      }
    });
    await this.prisma.users.update({
      where: {
        id: receiverInfo.id,
      },
      data: {
        pendingFriendReq: {
          connect: {
            id: userId,
          }
        }
      },
      include: {
        friends: true,
      }
    });
    const ret = await this.prisma.notifications.findUnique({
      where: {
        id: createNotif.id
      },
      include: {
        receiverUser: true,
      }
    });
    return ret;
  }



  async findAll(userId:number) {
    
    const allNotifs = await this.prisma.notifications.findMany({
      where: {
        receiverId: userId,
      }
    });
    return allNotifs;
  }

  async viewNotification(userId: number) {
    const notif = await this.prisma.notifications.findFirst({
      where: {
        receiverId: userId,
      }
    });
    const updateNotif = await this.prisma.notifications.update({
      where: {
        id: notif.id,
      },
      data: {
        read: true,
      }
    });
    return updateNotif;
  }

  async acceptFriend(notifBody: NotificationBody, userId: number) {
    const friend = await this.prisma.users.findUnique({
      where: {
        username: notifBody.receiverName,
      }
    });
    if (friend.id === userId) {
      throw new UnauthorizedException('should not be the same user!');
    }
    const alreadyFriend = await this.prisma.users.findFirst({
      where: {
        id: userId,
        friends: {
          some: {
            id: friend.id
          }
        }
      }
    });
    if (alreadyFriend) {
      throw new UnauthorizedException("already friends!");
    }
    const pendingFriend = await this.prisma.users.findFirst({
      where: {
        id: userId,
        pendingFriendReq: {
          some: {
            id: friend.id,
          }
        }
      },
    });
    if (!pendingFriend) {
      throw new UnauthorizedException("No friend request!");
    }
    //add users to friend lists
    const user = await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          connect: {
            id: friend.id
          }
        }
      },
      include: {
        friends: true,
      }
    });
    await this.prisma.users.update({
      where: {
        id: friend.id,
      },
      data: {
        friends: {
          connect: {
            id: userId
          }
        }
      },
      include: {
        friends: false,
        _count: false,
      }
    });
    await this.prisma.users.update({
      where: {
        id: friend.id,
      },
      data: {
        pendingFriendReq: {
          disconnect: {
            id: userId,
          }
        },
        pendingFriendReqOf: {
          disconnect: {
            id: userId,
          }
        }
      }
    });
    let notif = await this.prisma.notifications.findFirst({
      where: {
        id: notifBody.NotificationId,
      },
      include: {
        receiverUser: true,
      }
    });
    await this.prisma.notifications.deleteMany({
      where: {
        senderId: notif.senderId,
        receiverId: notif.receiverId,
        title: notif.title,
      }
    });
    return notif;
  }

  async refureFriend(notifBody: NotificationBody, userId: number) {
    const friend = await this.prisma.users.findUnique({
      where: {
        username: notifBody.receiverName,
      }
    });
    if (friend.id === userId) {
      throw new UnauthorizedException('should not be the same user!');
    }
    const alreadyFriend = await this.prisma.users.findFirst({
      where: {
        id: userId,
        friends: {
          some: {
            id: friend.id
          }
        }
      }
    });
    if (alreadyFriend) {
      throw new UnauthorizedException("already friends!");
    }
    const pendingFriend = await this.prisma.users.findFirst({
      where: {
        id: userId,
        pendingFriendReq: {
          some: {
            id: friend.id,
          }
        }
      },
    });
    if (!pendingFriend) {
      throw new UnauthorizedException("No friend request!");
    }
    await this.prisma.users.update({
      where: {
        id: friend.id,
      },
      data: {
        pendingFriendReq: {
          disconnect: {
            id: userId,
          }
        },
        pendingFriendReqOf: {
          disconnect: {
            id: userId,
          }
        }
      }
    });
    let notif = await this.prisma.notifications.findFirst({
      where: {
        id: notifBody.NotificationId,
      },
    });
    await this.prisma.notifications.deleteMany({
      where: {
        senderId: notif.senderId,
        receiverId: notif.receiverId,
        title: notif.title,
      }
    });
    return notif;
  }

}
