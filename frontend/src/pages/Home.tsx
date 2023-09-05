import { useEffect, useState } from "react"
import axios from "axios";
import { Chat } from "../components/Chats/Chat"
import { Rightbar } from "../components/Rightbar"
import { Leftbar } from "../components/Leftbar"
import io from 'socket.io-client';

interface User {
  id: number;
  username: string;
}

interface Chat {
  recId: number;
  msg: string;
}

export const Home = () => {
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users')
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
  const socket = io("http://localhost:8000");
  const currentUser = selectedChat ? users.find(_u => _u.id === selectedChat.recId) : null;
  var chatData = { _user: currentUser, _chat: selectedChat, _socket: socket }

  const [onlineUsers, setOnlineUsers] = useState([]);
  // const [receivedMsg, setReceivedMsg] = useState('');

  
  const sendMessage = () => {
    socket.emit('sendMessage', 'HADA MSG CHADID LAHJA')
  }

  useEffect(() => {

    socket.on('onlineUsers', (userIds) => {
      console.log('maaalna', userIds)
      setOnlineUsers(userIds);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
