import axios from "axios"
import { useEffect, useState } from "react"
import { Messages } from "./Messages";
import { Chat } from "./Chat";

interface User {
  id: number;
  username: string;
}

interface Chat {
  recId: number;
  msg: string;
}

export const Chats = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isOpen, setIsOpen] = useState(false)

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
  const chatDestination = () => {
    setIsOpen(true)
  }
  return (
    <div className="chats">
      {
        chats.map((chat, index) => (
          <div className="userChat" key={index}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV73Nl_MHzYV13X62NIRC8IX6FT6fenPinqCSSOS0HTQ&s" alt="" />
              <div className="userChatInfo">
                  <span>{users.find(_u => _u.id === chat?.recId)?.username}</span>
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
