import { useEffect, useRef, useState } from "react"
import axios from "axios";
import { Chat } from "../../components/Chats/Chat"
import { Rightbar } from "../../components/Rightbar"
import { Leftbar } from "../../components/Leftbar"
import io from 'socket.io-client';

interface User {
  id: number;
  username: string;
}

interface Chat {
  recId: number;
  msg: string;
}

export const HomeChat = () => {
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/users`, {withCredentials: true})
        setUsers(response.data)
      }
      catch (err) {
        console.error('Error fetching users: ', err)
      }
    }
    fetchUsers()
  }, [])

  const handleSelectedChat = (chat: any) => {
    setSelectedChat(chat)
  }

  const socket = io(`http://localhost:8000`);
  const currentUser = selectedChat ? users.find(_u => _u.id === selectedChat.recId) : null;
  var chatData = { _user: currentUser, _chat: selectedChat, _socket: socket }

  const [onlineUsers, setOnlineUsers] = useState([]);
  // const [receivedMsg, setReceivedMsg] = useState('');

  
  const sendMessage = () => {
    socket.emit('sendMessage', 'HADA MSG CHADID LAHJA')
  }

  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  const [mainUser, setMainUser] = useState<User | null>(null)

  useEffect(() => {
    const getUserId = async () => {
      const res = await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})
      setMainUser(res.data)
    }
    getUserId()
  }, [])
  

  useEffect(() => {
    socketRef.current = io('http://localhost:8000');

    // Example: Sending user ID during setup
    // getUserId()
    console.log('ID', mainUser)
    if (mainUser?.id !== undefined) {
      // console.log('WWWWWWWWWWWWWWWWWWWWW')
      const userId = mainUser.id//_MAIN_USER?.id; // Replace with the actual user ID
      socketRef.current.emit('setup', { userId });
    }

    // Cleanup socket connection on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [mainUser]);

  // useEffect(() => {

  //   socket.on('connected', (userIds) => {
  //     console.log('connected to server', userIds)
  //     // setOnlineUsers(userIds);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // const [connectedSocket, setConnectedSocket] = useState(false)
  // useEffect(() => {
  //   chatData._socket.emit('setup', chatData._user)
  //   chatData._socket.on('connected', () => setConnectedSocket(true))
  // }, [])

  // console.log('ChatData -- ', chatData, selectedChat)

  return (
    <div className='home'>
        <div className='container'>
            <Leftbar onValueChange={handleSelectedChat} />
            <Chat chatData={ chatData } />
            <Rightbar chatData={ chatData } />
        </div>
    </div>
  )
}
