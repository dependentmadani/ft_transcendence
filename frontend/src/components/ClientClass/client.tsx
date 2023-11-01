import {io, Socket } from 'socket.io-client'



class Client {
    id: number;
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
    signedIn: boolean;
    signedUp: boolean;
    search: string | null;
  
    constructor() {
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
      this.userStatus = 'OFLINE';
      this.signedIn = false;
      this.signedUp = false;
      this.search  = 'null';
    }
    
    
    
    clean() {
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
      this.userStatus = 'OFLINE';
      this.signedIn = false;
      this.signedUp = false;
      this.search  = 'null';
    }
}
  
export default Client;
  