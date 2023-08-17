import axios from "axios"
import { useEffect, useState } from "react"
import Add from '../img/add.png'
import More from '../img/more.png'
import { Input } from './Input'
import { Messages } from './Messages'

interface Chat {
  senId: Number,
  recId: number,
  msg: string,
}

// interface User {
//   id: number;
//   username: string;
// }

export const Chat = ({ selectedChat }) => {
  const [chats, setChats] = useState<Chat[]>([])
  // const [users, setUsers] = useState<User[]>([])

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

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8000/users')
  //       setUsers(response.data)
  //     }
  //     catch (err) {
  //       console.error('Error fetching users: ', err)
  //     }
  //   }
  //   fetchUsers()
  // }, [])

  console.log('l7maa9 ->', selectedChat)

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{ selectedChat?.username }</span>
        <div className="chatIcons">
          <img src={selectedChat?.avatar} alt="user_avatar" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages chatId={selectedChat}/>
      <Input />
    </div>
  )
}
