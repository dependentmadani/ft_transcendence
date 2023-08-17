import { useEffect, useState } from "react"
import axios from "axios";
import { Chat } from "../components/Chat"
import { Rightbar } from "../components/Rightbar"
import { Leftbar } from "../components/Leftbar"


interface User {
  id: number;
  username: string;
  // Add other properties if necessary
}

export const Home = () => {
  const [selectedChat, setSelectedChat] = useState(-1)
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

  const handleSelectedChat = (chatId: number): any => {
    setSelectedChat(chatId)
  }
  console.log('rah l id howa hada ->', users.find(_u => _u.id === selectedChat))
  return (
    <div className='home'>
        <div className='container'>
            <Leftbar onValueChange={handleSelectedChat} />
            <Chat selectedChat={ users.find(_u => _u.id === selectedChat) } />
            <Rightbar />
        </div>
    </div>
  )
}
