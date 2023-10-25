import { useEffect, useState } from "react"
import { Chat } from "@/components/Chat/Chats/Chat"
import { Rightbar } from "@/components/Chat/Rightbar"
import { Leftbar } from "@/components/Chat/Leftbar"
import io, { Socket } from 'socket.io-client';
import './style.css'
import { RoomProvider } from "@/context/RoomsContext";
import { AllowProvider } from "@/context/AllowContext";
import axios from "axios";

interface User {
  id: number,
}

export const HomeChat = () => {

  const [selectedChat, setSelectedChat] = useState<any>();
  const [socket, setSocket] = useState<Socket>()
  const [mainUser, setMainUesr] = useState<User>()
  

  useEffect(() => {

    const getMainUser = async () => {
        const res = await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})
        setMainUesr(res.data)
    }

    getMainUser()
  }, [socket])

  console.log('MAIN____________USER', mainUser)
  
  useEffect(() => {

    // const token = ''
    const _socket: any = io(`http://${import.meta.env.VITE_BACK_ADDRESS}/chat`);
    // _socket.emit('connect', mainUser?.id)
    // _socket.on('connect', () => {
    //   console.log('connected')
    // })
    // console.log('Yooooo', _socket);
    setSocket(_socket)

    // Listen for messages from the backend
    // socket?.on('messageFromServer', (message) => {
    //   console.log('Received message from server:', message);
    // });
    
    return () => {
      socket?.disconnect()
    }
  }, []);

  useEffect(() => {

    // let user: any
    const getMain = async () => {
      const res = await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})
      // user = res.data
      socket?.emit('someEvent', res.data?.id);
    }
    getMain()
  

    
    return () => {
      socket?.off('someEvent');
    }
  }, [socket]);
  
  const handleSelectedChat = (chat: any) => {
    setSelectedChat(chat)
    console.log('ffff', chat)
    chatData._chat = chat
  }

  const chatData = { _chat: selectedChat, _socket: socket }

  // console.log('chatdata', chatData)


  return (
    <div className='home'>
        <div className='container'>
          <RoomProvider>
            <AllowProvider > 
              <Leftbar onValueChange={handleSelectedChat} chatData={ chatData } />
              <Chat chatData={ chatData } />
              <Rightbar chatData={ chatData } />
            </AllowProvider > 
          </RoomProvider>
        </div>
    </div>
  )
}
