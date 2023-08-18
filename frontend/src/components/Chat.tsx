import axios from "axios"
import { useEffect, useState } from "react"
import Add from '../img/add.png'
import More from '../img/more.png'
import { Input } from './Input'
import { Messages } from './Messages'

interface Chat {
  chatId: Number,
  usrChatId: Number,
  // senId: Number,
  // recId: number,
  // msg: string,
}

// interface User {
//   id: number;
//   username: string;
// }

export const Chat = ({ currentUser }: any) => {
  const [chats, setChats] = useState<Chat[]>([])
  // // const [users, setUsers] = useState<User[]>([])

  // useEffect(() => {
  //   const fetchChats = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8000/chat')
  //       setChats(response.data)
  //     }
  //     catch (err) {
  //       console.error('Error fetching chats: ', err)
  //     }
  //   }
  //   fetchChats()
  // }, [])
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/chat')
        setChats(response.data)
      }
      catch (err) {
        console.error('Error fetching chats: ', err)
      }
    }
    fetchChats()
  }, [])

  console.log('llhj ', chats.find(_chat => _chat?.usrChatId === currentUser?.id))
  const currentChat = chats.find(_chat => _chat?.usrChatId === currentUser?.id)
  console.log('l7maa9 ->', currentChat, 'chats ', chats)

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{ currentUser?.username }</span>
        <div className="chatIcons">
          <img src={ currentUser?.avatar } alt="user_avatar" />
          <img src={Add} alt="add_icon" />
          <img src={More} alt="more_icon" />
        </div>
      </div>
      <Messages currentChat={ currentChat }/>
      <Input />
    </div>
  )
}
