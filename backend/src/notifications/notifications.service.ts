import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NotificationDto } from './dto/create-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: NotificationDto, userId: number, socketId: string) {
    // console.log('the user id is:', createNotificationDto);
    if (userId == createNotificationDto.receiverId) {
      throw new UnauthorizedException("Cannot send add friend request to yourself!");
    }
    const alreadyFriend = await this.prisma.users.findFirst({
      where: {
        id: userId,
        friends: {
          some: {
            id: createNotificationDto.receiverId,
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
        read: createNotificationDto.read,
        description: createNotificationDto.description,
        icon: createNotificationDto.icon,
        socketId: socketId,
        receiverId: createNotificationDto.receiverId,
        senderId: userId
      },
    });
    const updatedUser = await this.prisma.users.update({
      where: {
        id: createNotificationDto.receiverId,
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
    return await this.prisma.users.update({
      where: {
        id: createNotificationDto.receiverId,
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
    // return updatedUser;
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

  async acceptFriend(friendUsername: string, userId: number) {
    const friend = await this.prisma.users.findUnique({
      where: {
        username: friendUsername,
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
    //remove users from pending list
    // await this.prisma.users.update({
    //   where: {
    //     id: userId,
    //   },
    //   data: {
    //     pendingFriendReq: {
    //       disconnect: {
    //         id: friend.id,
    //       }
    //     },
    //     pendingFriendReqOf: {
    //       disconnect: {
    //         id: friend.id,
    //       }
    //     }
    //   }
    // });
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
    return user;
  }

  async refureFriend(friendUsername: string, userId: number) {
    const friend = await this.prisma.users.findUnique({
      where: {
        username: friendUsername,
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
    return '';
  }

}
