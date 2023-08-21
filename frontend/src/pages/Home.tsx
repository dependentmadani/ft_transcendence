import { useEffect, useState } from "react"
import axios from "axios";
import { Chat } from "../components/Chat"
import { Rightbar } from "../components/Rightbar"
import { Leftbar } from "../components/Leftbar"


interface User {
  id: number;
  username: string;
}

interface Chat {
  recId: number;
  msg: string;
}

// interface ChatData {
//   _user: User,
//   _chat: Chat,
// }

export const Home = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [users, setUsers] = useState<User[]>([])

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

  const handleSelectedChat = (chat: Chat): any => {
    setSelectedChat(chat)
  }
  // const currentUser = users.find(_u => _u.id === selectedChat)
  const currentUser = selectedChat ? users.find(_u => _u.id === selectedChat.recId) : null;
  const chatData = { _user: currentUser, _chat: selectedChat }

  return (
    <div className='home'>
        <div className='container'>
            <Leftbar onValueChange={handleSelectedChat} />
            <Chat chatData={ chatData } />
            <Rightbar currentUser={ currentUser } />
        </div>
    </div>
  )
}
