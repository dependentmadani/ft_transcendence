import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserModify } from './dto/create-users.dto';
import { Users } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { error } from 'console';

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
    try {
      const user =
        await this.prisma.users.findUnique({
          where: {
            id: userId,
          },
          include: {
            friends: true,
            blocked: true,
            games: true
          }
        });
      return user;
    }
    catch (err) {
      console.log('error: ', err)
    }
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
          // console.log('result', result);
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
      },
      include: {
        games: true,
      }
    });
    return user;
  }

  async searchSpecificUser(username:string, users:Users) {
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
    const myUser = await this.prisma.users.findUnique({
      where: {
        email: users.email,
      },
      include: {
        blocked: true,
        blockedBy: true,
      }
    });
    const result = user.filter((user1) => ((!myUser.blocked.some((user2) => (user2.username === user1.username)) && !myUser.blockedBy.some((user2) => (user2.username === user1.username)))));
    // console.log('the result is', result)
    return result
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
          },
          include: {
            games: true
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
      },
      include: {
        blocked: true,
      }
    });
    if (checkFriend) {
      throw new UnauthorizedException('Already friends! :D');
    }
    const checker = checkFriend.blocked.map((users) => {
      if (users.id === friendId) {
        return true;
      }
    })
    if (checker) {
      this.unblockFriend(userId, friendId);
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
    // const areTheyFriends = await this.prisma.users.findFirst({
    //   where: {
    //     id: userId,
    //     friends: {
    //       some: {
    //         id: friendId
    //       }
    //     }
    //   }
    // });
    // if (!areTheyFriends) {
    //   throw new UnauthorizedException("Not a friend to block!");
    // }
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
        blockedBy: {
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

  async unfriend(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new UnauthorizedException("The same user is not allowed")
    }
    const isHeFriend = await this.prisma.users.findUnique({
      where: {
        id: userId,
        friends: {
          some: {
            id: friendId,
          }
        }
      },
    });
    if (! isHeFriend) {
      throw new UnauthorizedException("He is not friend");
    }
    await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
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
        friends: {
          disconnect: {
            id: userId,
          }
        }
      }
    });
    return "removed friend successufully"
  }

  async unblockFriend(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new UnauthorizedException("the same user is not allowed!");
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
        blockedBy: {
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
      // console.log('user information: ', user)
        
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
              '/uploads/' + filePath,
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
