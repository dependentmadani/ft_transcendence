import { useEffect, useState } from "react"
import { Chat } from "@/components/Chat/Chats/Chat"
import { Rightbar } from "@/components/Chat/Rightbar"
import { Leftbar } from "@/components/Chat/Leftbar"
import io, { Socket } from 'socket.io-client';
import './style.scss'


export const HomeChat = () => {

  const [selectedChat, setSelectedChat] = useState<any>();
  const [socket, setSocket] = useState<Socket>()
  

  useEffect(() => {
    const _socket: any = io(`http://${import.meta.env.VITE_FRONT_ADDRESS}/chat`);
    setSocket(_socket)
    
    return () => {
      socket?.disconnect()
    }
  }, []);
  
  const handleSelectedChat = (chat: any) => {
    setSelectedChat(chat)
    chatData._chat = selectedChat
  }

  const chatData = { _chat: selectedChat, _socket: socket }

  // console.log('address', import.meta.env.VITE_FRONT_ADDRESS)


  return (
    <div className='home'>
        <div className='container'>
            <Leftbar onValueChange={handleSelectedChat} chatData={ chatData } />
            <Chat chatData={ chatData } />
            <Rightbar chatData={ chatData } />
        </div>
    </div>
  )
}
