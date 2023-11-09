export {};

declare global {

  interface GameData {
    wins: number;
    gamesPlayed: number;
  }


  interface Badge {
    first_server : boolean;
    conqueror : boolean;
    ai_crusher : boolean;
    disciplined : boolean;
    extrouvert : boolean;
    failure : boolean;
    challenger : boolean;
  }




  interface User {
    id: number;
    username: string;
    avatar: string,
    rank: number;
    userStatus: string;
    games: GameData;
  }
      
  interface Chat {
    chatId: number,
    chatUsers: number[],
    sender: User,
    receiver: User,
    latestMessageDate: Date,
    latestMessageContent: string,
    type: string,
  }
  
  interface Room {
    id: number,
    roomName: string,
    roomAvatar: string,
    roomType: string,
    // latestMessageDate: string,
    // latestMessageContent: string,
    type: string,
    roomPass: string,
  }
  
  interface roomUsers {
    id: number,
    roomId: number,
    userId: number,
  }
  
  interface Contact {
    id: number,
    name: string,
    roomName: string,
    chatName: string,
    avatar: string,
    type: string,
    latestMessageContent: string,
    password: string,
    protection: string,
  
    // Chat
    chat: Chat,
    receiver: User,
    // Room
    room: Room,
  }
  
  interface Message {
    messageId: number,
    textContent: string,
    msgRoomId: number,
    msgChatId: number,
    type: string,
  }
  
}