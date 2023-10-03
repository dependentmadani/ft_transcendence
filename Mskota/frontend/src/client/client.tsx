import {io, Socket } from 'socket.io-client'



class Client {
    _id: number;
    _socket: Socket | null;
    _username: string;
    _avatar: File | null;
    _createdAt: Date;
    _userStatus: string;
    _isActive: boolean;
    _email: string | null;
    _hashRt: string | null;
    _twofa: string | null;
    _password: string | null;
    _twofaEmail: string | null;
    _twoEnabled: boolean;
    _updatedAt: Date;
  
    constructor() {
      this._socket = null;
      this._id = -1;
      this._username = '';
      this._avatar = null;
      this._createdAt = new Date; // Corrected typo 'ceeatedAt' to 'createdAt'
      this._email = null;
      this._hashRt = null;
      this._isActive = true;
      this._password = null;
      this._twoEnabled = false;
      this._twofa = null;
      this._twofaEmail = null;
      this._updatedAt = new Date;
      this._userStatus = 'ONLINE';
    }

    setData(data: any) {
        this._id = data.id;
        this._username = data.username;
        this._avatar = data.avatar;
        this._createdAt = data.createdAt; // Corrected typo 'ceeatedAt' to 'createdAt'
        this._email = data.email;
        this._hashRt = data.hashRt;
        this._isActive = data.isActive;
        this._password = data.password;
        this._twoEnabled = data.twoEnabled;
        this._twofa = data.twofa;
        this._twofaEmail = data.twofaEmail;
        this._updatedAt = data.updatedAt;
        this._userStatus = data.userStatus;
    }

    toString() {
        return `
            Client Data:
            ID: ${this._id}
            Username: ${this._username}
            Avatar: ${this._avatar}
            Created At: ${this._createdAt}
            Email: ${this._email}
            HashRt: ${this._hashRt}
            IsActive: ${this._isActive}
            Password: ${this._password}
            Two Enabled: ${this._twoEnabled}
            TwoFA: ${this._twofa}
            TwoFA Email: ${this._twofaEmail}
            Updated At: ${this._updatedAt}
            User Status: ${this._userStatus}
        `;
    }
}
  
export default Client;
  