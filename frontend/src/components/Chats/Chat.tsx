import axios from "axios"
import { useEffect, useState } from "react"
// import Add from '../img/add.png'
// import More from '../img/more.png'
import { Input } from '../Input'
// import { Messages } from './Messages'

// interface User {}
interface Chat {}

let currentChat: {}

export const Chat = ({ chatData }: any) => {
  const [, setChats] = useState<Chat[]>([])
  

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/chat')
        setChats(response.data)
        
        chatData._socket.emit('joinChat', chatData._chat?.chatId)
      }
      catch (err) {
        console.error('Error fetching chats: ', err)
      }
    }
    fetchChats()
  }, [])

  // const currentUser = chatData._user
  currentChat = chatData._chat

  // console.log('chat data', chatData)

  return (
    <div className='chat'>
      {/* <div className="chatInfo">
        <span>{ currentUser?.username }</span>
        <div className="chatIcons">
          <img src={ currentUser?.avatar } alt="user_avatar" />
          <img src={Add} alt="add_icon" />
          <img src={More} alt="more_icon" />
        </div>
      </div> */}
      {/* <Messages currentChat={ currentChat } /> */}
      <Input chatData={ chatData } />
    </div>
  )
}
