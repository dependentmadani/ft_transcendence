import axios from "axios"
import { useEffect, useState } from "react"
// import { Messages } from "./Messages";
import { Chat } from "./Chat";

interface User {
  id: number;
  username: string;
  avatar: string,
}

interface Chat {
  recId: number;
  msg: string;
}

export const Chats = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [users, setUsers] = useState<User[]>([])
  // const [isOpen, setIsOpen] = useState(false)

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

  // console.log('users: ', users.find(_u => _u.id === 1))
  // const chatDestination = () => {
  //   setIsOpen(true)
  // }

  return (
    <div className="chats">
      {
        chats.map((chat, index) => (
          <div className="userChat" key={index}>
              <img src={ users.find(_u => _u.id === chat?.recId)?.avatar } alt="user_avatar" />
              <div className="userChatInfo">
                  <span>{users.find(_u => _u.id === chat?.recId)?.username }</span>
                  <p>{ chat?.msg }</p>
                  {/* <button onClick={chatDestination} >gg</button>
                  <Messages isOpen={isOpen} /> */}
              </div>
          </div>
        ))
      }
    </div>
  )
}
