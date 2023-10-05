import {io, Socket } from 'socket.io-client'



class Client {
    id: number;
    socket: Socket | null;
    username: string;
    avatar: File | null;
    createdAt: Date | null;
    userStatus: string;
    isActive: boolean;
    email: string | null;
    hashRt: string | null;
    twofa: string | null;
    password: string | null;
    twofaEmail: string | null;
    twoEnabled: boolean;
    updatedAt: Date | null;
  
    constructor() {
      this.socket = null;
      this.id = -1;
      this.username = '';
      this.avatar = null;
      this.createdAt = null; // Corrected typo 'ceeatedAt' to 'createdAt'
      this.email = null;
      this.hashRt = null;
      this.isActive = true;
      this.password = null;
      this.twoEnabled = false;
      this.twofa = null;
      this.twofaEmail = null;
      this.updatedAt = null;
      this.userStatus = 'ONLINE';
    }


    toString() {
        return `
            Client Data:
            ID: ${this.id}
            Username: ${this.username}
            Avatar: ${this.avatar}
            Created At: ${this.createdAt}
            Email: ${this.email}
            HashRt: ${this.hashRt}
            IsActive: ${this.isActive}
            Password: ${this.password}
            Two Enabled: ${this.twoEnabled}
            TwoFA: ${this.twofa}
            TwoFA Email: ${this.twofaEmail}
            Updated At: ${this.updatedAt}
            User Status: ${this.userStatus}
        `;
    }
}
  
export default Client;
  