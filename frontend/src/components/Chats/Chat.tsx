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
        console.error('Error fetching chats: ', err)
      }
    }
    fetchChats()
  }, [])

  currentChat = chatData._chat

  return (
    <div className='chat'>
      {/* <Messages messages={ messages } /> */}
      <Input chatData={ chatData } chat={currentChat} />
    </div>
  )
}
