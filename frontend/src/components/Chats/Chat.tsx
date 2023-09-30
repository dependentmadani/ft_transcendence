import axios from "axios"
import { useEffect, useState } from "react"
import { Input } from '../Input'

interface Chat {}

let currentChat: {}

export const Chat = ({ chatData }: any) => {
  const [, setChats] = useState<Chat[]>([])
  

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/chat`, {withCredentials: true})
        setChats(response.data)
        
        chatData._socket.emit('joinChat', chatData._chat?.chatId)
      }
      catch (err) {
        console.error('No chats')
      }
    }
    fetchChats()
  }, [])

  currentChat = chatData._chat

  // console.log('what wronkk2', chatData?._chat)

  return (
    <div id='Conversation' className='chat'>
      {/* <Messages messages={ messages } /> */}
      <Input chatData={ chatData } chat={currentChat} />
    </div>
  )
}
