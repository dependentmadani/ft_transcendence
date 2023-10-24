import { useEffect, useState } from "react"
import { Chat } from "@/components/Chat/Chats/Chat"
import { Rightbar } from "@/components/Chat/Rightbar"
import { Leftbar } from "@/components/Chat/Leftbar"
import io, { Socket } from 'socket.io-client';
import './style.css'
import { RoomProvider } from "@/context/RoomsContext";

export const HomeChat = () => {

  const [selectedChat, setSelectedChat] = useState<any>();
  const [socket, setSocket] = useState<Socket>()
  

  useEffect(() => {
    const _socket: any = io(`http://${import.meta.env.VITE_BACK_ADDRESS}/chat`);
    // console.log('Yooooo', _socket);
    setSocket(_socket)
    
    return () => {
      socket?.disconnect()
    }
  }, []);
  
  const handleSelectedChat = (chat: any) => {
    setSelectedChat(chat)
    console.log('ffff', chat)
    chatData._chat = chat
  }

  const chatData = { _chat: selectedChat, _socket: socket }

  console.log('chatdata', chatData)


  return (
    <div className='home'>
        <div className='container'>
          <RoomProvider>
            <Leftbar onValueChange={handleSelectedChat} chatData={ chatData } />
            <Chat chatData={ chatData } />
            <Rightbar chatData={ chatData } />
          </RoomProvider>
        </div>
    </div>
  )
}
