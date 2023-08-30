import { useEffect, useState } from "react"
import axios from "axios";
import { Chat } from "../components/Chat"
import { Rightbar } from "../components/Rightbar"
import { Leftbar } from "../components/Leftbar"

import io from 'socket.io-client';
import { Socket } from "socket.io-client/debug";
import { RoomCreationModal } from "../components/RoomCreationModal";

interface User {
  id: number;
  username: string;
}

interface Chat {
  recId: number;
  msg: string;
}

// interface ChatData {
//   _user: User,
//   _chat: Chat,
// }

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
  // const currentUser = users.find(_u => _u.id === selectedChat)
  const currentUser = selectedChat ? users.find(_u => _u.id === selectedChat.recId) : null;
  var chatData = { _user: currentUser, _chat: selectedChat, _socket: socket }

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [receivedMsg, setReceivedMsg] = useState('');

  
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

  // useEffect(() => {
  //   socket.on('receivedMessage', (msg) => {
  //     setReceivedMsg(msg)
  //   })
  // }, [socket]);



  
    

    
  console.log('lusers z3ma', onlineUsers)
  console.log('MSG', receivedMsg)

  console.log('chat data', chatData)
  
  // var isOpen = true

  return (
    <div className='home'>
      {/* <button onClick={sendMessage}> Send Message</button>
      <h1>Online Users</h1>
      <ul>
        {onlineUsers.map((userId) => (
          <li key={userId}>{userId}</li>
        ))}
      </ul> */}
        <div className='container'>
            <Leftbar onValueChange={handleSelectedChat} />
            <Chat chatData={ chatData } />
            <Rightbar chatData={ chatData } />
        </div>
    </div>
  )
}
