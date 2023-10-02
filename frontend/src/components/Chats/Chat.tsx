import axios from "axios"
import { useEffect, useState } from "react"
import { Input } from '../Input'

interface Chat {}

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
        console.log('No chats')
      }
    }
    fetchChats()
  }, [])


  return (
    <div id='Conversation' className='chat'>
      {/* <Messages messages={ messages } /> */}
      <Input chatData={ chatData } />
    </div>
  )
}
