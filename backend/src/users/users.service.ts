import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserModify } from './dto/create-users.dto';
import { Users } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  async findAllUsers(): Promise<Users[]> {
    const users =
      await this.prisma.users.findMany();
    if (!users)
      throw new NotFoundException(
        'The user is not found',
      );

      return users;
  }

  async findUserById(
    userId: number,
  ): Promise<Users> {
    const user =
      await this.prisma.users.findUnique({
        where: {
          id: userId,
        },
        include: {
          friends: true,
          blocked: true,
        }
      });
    return user;
  }

  async getAchievements(userId: number) {
    const games = await this.prisma.game.findUnique({
      where: {
        userId: userId,
      }
    });
    const historyGames = await this.prisma.history.findMany({
      where: {
        myUserId: userId,
      }
    });
    var result = {
      "first_server": false,
      "conqueror": false,
      "ai_crusher": false,
      "disciplined": false,
      "introuvert": false,
      "challenger": false,
    }

    if (!games) {
      return result;
    }
    if (games.wins >= 1) {
      result.first_server = true;
    }
    if (games.wins >= 3) {
      result.conqueror = true;
    }
    if (games.gamesPlayed >= 5) {
      result.disciplined = true;
    }
    const uniqueIds = new Set<number>();
    historyGames.forEach((obj) => {
      uniqueIds.add(obj.oppUserId);
    });
    if (uniqueIds.size >= 3) {
      result.challenger = true;
    }
    const akinator = await this.prisma.users.findUnique({
      where: {
        username: 'akinator',
      }
    });
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        friends: true,
      }
    });
    historyGames.forEach((obj) => {
      if (obj.oppUserId === akinator.id) {
        if (obj.myScore > obj.oppScore) {
          result.ai_crusher = true;
          console.log('result', result);
          return true;
        }
      }
    });
    if (user.friends.length >= 5) {
      result.introuvert = true;
    }

    return result;
  }

  async checkBlockedFriend(userId: number, friendId: number) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
        blocked: {
          some: {
            id: friendId,
          }
        }
      }
    });
    if (user) {
      return true;
    }
    return false;
  }

  async friendFriends(userId:number, friendId: number) {
    const friend = await this.prisma.users.findUnique({
      where: {
        id: userId,
        friends: {
          some: {
            id: friendId
          }
        }
      },
    });

    if (!friend) {
      throw new UnauthorizedException("not your friend");
    }

    const friendsList = await this.prisma.users.findUnique({
      where: {
        id: friendId,
      }, 
      include: {
        friends: true
      }
    })

    return friendsList.friends;
  }

  async searchUser(username: string, users: Users) {
    if (username === '') {
      throw new UnauthorizedException('empty username not allowed');
    }
    const user = await this.prisma.users.findMany({
      where: {
        username: {
          startsWith: username,
          mode: 'insensitive',
        },
        email : {
          not: users.email
        }
      }
    });
    return user;
  }

  async searchFriendUser(username: string, users: Users) {
    if (username === '') {
      throw new UnauthorizedException('empty username not allowed');
    }
    const user = await this.prisma.users.findMany({
      where: {
        email: users.email,
      },
      select: {
        friends: {
          where: {
            username: {
              startsWith: username,
              mode: 'insensitive',
            }
          }
        }
      }
    });

    return user[0]?.friends;
  }

  async addFriend(userId: number, friendId: number) {
    const friendExists = await this.prisma.users.findUnique({
      where: {
        id: friendId
      }
    });
    if (!friendExists){ 
      throw new UnauthorizedException("this friend does not exist!");
    }
    if (userId === friendId) {
      throw new UnauthorizedException("You cannot add yourself as friend! :)");
    }
    const checkFriend = await this.prisma.users.findFirst({
      where: {
        id: userId,
        friends: {
          some: {
            id: friendId
          }
        }
      }
    });
    if (checkFriend) {
      throw new UnauthorizedException('Already friends! :D');
    }
    const user = await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        pendingFriendReq: {
          connect: {
            id: friendId
          }
        }
      },
      include: {
        friends: true,
      }
    });
    // await this.prisma.users.update({
    //   where: {
    //     id: friendId,
    //   },
    //   data: {
    //     pendingFriendReq: {
    //       connect: {
    //         id: userId
    //       }
    //     }
    //   },
    //   include: {
    //     friends: false,
    //     _count: false,
    //   }
    // });
    return user;
  }

  async blockFriend(userId: number, friendId: number) {
    const availableFriend = await this.prisma.users.findUnique({
      where: {
        id: friendId
      }
    });
    if (!availableFriend) {
      throw new UnauthorizedException('friend is not available');
    }
    const isHeBlocked = await this.prisma.users.findFirst({
      where: {
        id: userId,
        blocked: {
          some: {
            id: friendId,
          }
        }
      }
    });
    if (isHeBlocked) {
      throw new UnauthorizedException('friend already blocked! :(');
    }
    const blockUser = await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          disconnect: {
            id: friendId,
          }
        },
        blocked: {
          connect: {
            id: friendId
          }
        }
      }
    });
    await this.prisma.users.update({
      where: {
        id: friendId,
      },
      data: {
        friends: {
          disconnect: {
            id: userId,
          }
        },
        blocked: {
          connect: {
            id: userId,
          }
        }
      }
    });
    
    return blockUser;
  }

  async mutualFriends(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new UnauthorizedException("the same user is not allowed!");
    }
    const  userFriends = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        friends: true
      }
    });
    const friendFriends = await this.prisma.users.findUnique({
      where: {
        id: friendId,
      },
      include: {
        friends: true
      }
    });
    if (!friendFriends) {
      throw new NotFoundException("the user is not found");
    }
    const mutualFriends = await this.mutualFriendsFinder(userFriends.friends, friendFriends.friends);

    return mutualFriends;
  }

  async unblockFriend(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new UnauthorizedException("the same user is nto allowed!");
    }
    const isHeBlocked = await this.prisma.users.findFirst({
      where: {
        id: userId,
        blocked: {
          some: {
            id: friendId
          }
        }
      }
    });
    if (!isHeBlocked) {
      throw new UnauthorizedException('The user is not blocked!');
    }
    const unblockFriend = await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        blocked: {
          disconnect: {
            id: friendId,
          }
        }
      }
    });

    await this.prisma.users.update({
      where: {
        id: friendId,
      },
      data: {
        blocked: {
          disconnect: {
            id: userId,
          }
        }
      }
    });

    return unblockFriend;
  }

  async mutualFriendsFinder(userFriends: any, friendFriends: any) {
    const user = userFriends.map(obj =>obj.id);
    const returnValue = friendFriends.filter(friend => user.includes(friend.id));

    return returnValue
  }

  async findUserByUsername(
    username: string,
  ): Promise<Users> {
    const user =
      await this.prisma.users.findUnique({
        where: {
          username: username,
        },
      });
    return user;
  }

  async updateUser(
    userId: number,
    userInfo: Users,
    username: UserModify,
  ) {
    try {
      const user = await this.prisma.users.update(
        {
          where: {
            id: userId,
          },
          data: {
            username: username.username,
            signedUp: true,
          },
        },
        );
      console.log('user information: ', user)
        
      return user;
    } catch {
      throw new UnauthorizedException(
        'username must be unique',
      );
    }
  }

  async deleteUser(
    userId: number,
  ): Promise<void> {
    const user =
      await this.prisma.users.findUnique({
        where: {
          id: userId,
        },
      });
    if (user)
      await this.prisma.users.delete({
        where: {
          id: userId,
        },
      });
  }

  async uploadAvatar(
    userId: number,
    filePath: string,
  ) {
    try {
      const user = await this.prisma.users.update(
        {
          where: {
            id: userId,
          },
          data: {
            avatar:
              '/uploadAvatar/' + filePath,
          },
        },
      );
      return user;
    } catch {
      throw new UnauthorizedException(
        'userId is wrong somehow! :(',
      );
    }
  }

  async getAvatar(
    userId: number,
  ): Promise<string> {
    try {
      const user =
        await this.prisma.users.findUnique({
          where: {
            id: userId,
          },
        });

      return user.avatar;
    } catch {
      throw new UnauthorizedException(
        'something wrong with userId! :(',
      );
    }
  }
}
