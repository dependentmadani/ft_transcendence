export {};

declare global {

    interface User {
      id: number;
      username: string;
      avatar: string,
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
}