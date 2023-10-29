import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NotificationBody, NotificationDto } from './dto/create-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Users, Notifications } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}


  async getNotifications(): Promise<Notifications[]> {
    try {
      return this.prisma.notifications.findMany()
    }
    catch {
        throw new UnauthorizedException("Couldn't find any Notification")
    }
  }

  
  async isNotifFound(senderId: number, receiverId: number): Promise<boolean> {
    try {
      const res = await this.prisma.notifications.findMany({
        where: {
          AND: [
            { senderId: senderId },
            { receiverId: receiverId },
          ]
        }
      })
      if (res)
        return false
      return true
    }
    catch {
      return true
    }
  }

  async createNotification(type: any, read: boolean, receiverId: number, senderId: number, mode: string): Promise<Notifications> {
    
    const receiverInfo = await this.prisma.users.findUnique({
      where: {
        id: receiverId
      }
    })
    if (senderId == receiverInfo.id) {
      throw new UnauthorizedException("Cannot send add friend request to yourself!");
    }
    // const alreadyFriend = await this.prisma.users.findFirst({
    //   where: {
    //     id: senderId,
    //     friends: {
    //       some: {
    //         id: receiverInfo.id,
    //       }
    //     }
    //   }
    // });
    // if (alreadyFriend) {
    //   throw new UnauthorizedException("already friends!");
    // }

    const createNotif = await this.prisma.notifications.create({
      data: {
        type: type,
        read: read,
        receiverId: receiverId,
        senderId: senderId,
        mode: mode,
      },
    });
    const updatedUser = await this.prisma.users.update({
      where: {
        id: receiverId,
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
        id: senderId,
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
        id: receiverId,
      },
      data: {
        pendingFriendReq: {
          connect: {
            id: senderId,
          }
        }
      },
      include: {
        friends: true,
      }
    });
    return await this.prisma.notifications.findUnique({
      where: {
        id: createNotif.id
      },
      include: {
        receiverUser: true,
      }
    });
  }

  async updateNotification(id: number): Promise<Notifications> {
    try {
      console.log('IIIIOOOOOIII')
      const notif = await this.prisma.notifications.findUnique({
        where: {
          id: id
        }
      });

      if (!notif) {
        throw new UnauthorizedException(`Notification with id ${id} not found!`);
      }

      return await this.prisma.notifications.update({
        where: {
          id: id,
        },
        data: {
          read: true
        }
      });
    }
    catch {
      throw new UnauthorizedException(`Something went Wrong!`);
    }
  }

  async friendAcception(receiverId: number, senderId: number, notifId: number) {
    const friend = await this.prisma.users.findUnique({
      where: {
        id: receiverId,
      }
    });
    if (friend.id === senderId) {
      throw new UnauthorizedException('should not be the same user!');
    }
    const alreadyFriend = await this.prisma.users.findFirst({
      where: {
        id: senderId,
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
        id: senderId,
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
        id: senderId,
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
            id: senderId
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
            id: senderId,
          }
        },
        pendingFriendReqOf: {
          disconnect: {
            id: senderId,
          }
        }
      }
    });
    let notif = await this.prisma.notifications.findFirst({
      where: {
        id: notifId,
      },
      include: {
        receiverUser: true,
      }
    });
    await this.prisma.notifications.deleteMany({
      where: {
        senderId: notif.senderId,
        receiverId: notif.receiverId,
        // title: notif.title,
      }
    });
    return notif;
  }

  async deleteNotification(id: number) {
    const notif = await this.prisma.notifications.findUnique({
      where: {
          id: id
      }
    })
    if (notif) {
        return await this.prisma.notifications.delete({
            where: {
                id: id
            }
        })
    }
    else
        return `Couldn't find chat with id ${id}`
  }

  ///////////////////////////////////

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
        // title: createNotificationDto.title,
        type: createNotificationDto.type,
        read: createNotificationDto.read,
        // description: createNotificationDto.description,
        // icon: createNotificationDto.icon,
        // socketId: socketId,
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
    return await this.prisma.notifications.findUnique({
      where: {
        id: createNotif.id
      },
      include: {
        receiverUser: true,
      }
    });
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

  async acceptFriend(receiverId: number, senderId: number, notifId: number) {
    const friend = await this.prisma.users.findUnique({
      where: {
        id: receiverId,
      }
    });
    if (friend.id === senderId) {
      throw new UnauthorizedException('should not be the same user!');
    }
    const alreadyFriend = await this.prisma.users.findFirst({
      where: {
        id: senderId,
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
        id: senderId,
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
        id: senderId,
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
            id: senderId
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
            id: senderId,
          }
        },
        pendingFriendReqOf: {
          disconnect: {
            id: senderId,
          }
        }
      }
    });
    let notif = await this.prisma.notifications.findFirst({
      where: {
        id: notifId,
      },
      include: {
        receiverUser: true,
      }
    });
    await this.prisma.notifications.deleteMany({
      where: {
        senderId: senderId,
        receiverId: receiverId,
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
        // title: notif.title,
      }
    });
    return notif;
  }

}
