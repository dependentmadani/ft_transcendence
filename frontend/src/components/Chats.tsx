import axios from "axios"
import { useEffect, useState } from "react"

export const Chats = () => {
  const [chats, setChats] = useState([])

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

  const [users, setUsers] = useState([])

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

  console.log('users: ', users.find(_u => _u.id === 1))
  return (
    <div className="chats">
      {
        chats.map((chat, index) => (
          <div className="userChat" key={index}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV73Nl_MHzYV13X62NIRC8IX6FT6fenPinqCSSOS0HTQ&s" alt="" />
              <div className="userChatInfo">
                  <span>{users.find(_u => _u.id === chat?.recId)?.username}</span>
                  <p>{ chat?.msg }</p>
              </div>
          </div>
        ))
      }
    </div>
  )
}
