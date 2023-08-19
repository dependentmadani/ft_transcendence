import axios from "axios"
import { useEffect, useState } from "react"
// import { Messages } from "./Messages";
import { Chat } from "./Chat";
// import { Message } from "./Message";

interface User {
  id: number;
  username: string;
  avatar: string,
}

interface Chat {
  chatId: number,
  recId: number;
  msg: string;
}

interface ChildComponentProps {
  selectedChat: (val: number) => -1;
}

const _USER_: Number = 1 // for now

export  const Chats: React.FC<ChildComponentProps> = ({ selectedChat }) => {
    const [chats, setChats] = useState<Chat[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [selectedContact, setSelectedContact] = useState(-1);
  // const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/chat/${_USER_}`)
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
        const response = await axios.get(`http://localhost:8000/users`)
        setUsers(response.data)
      }
      catch (err) {
        console.error('Error fetching users: ', err)
      }
    }
    fetchUsers()
  }, [])

  console.log(selectedContact)
  // const chatDestination = () => {
    //   setIsOpen(true)
    // }
  
  
  
  const handleClick = (chat: Chat) => {
    setSelectedContact(chat?.chatId);
    selectedChat(chat.chatId)
  };

  

  return (
    <div className="chats">
      {
        chats.map((chat, index) => (
          <div className="userChat" key={index} onClick={() => handleClick(chat)} >
              <img src={ users.find(_u => _u.id === chat?.recId)?.avatar } alt="user_avatar" />
              <div className="userChatInfo">
                  <span>{users.find(_u => _u.id === chat?.recId)?.username }</span>
                  <p>latest message</p>
                  {/* <button onClick={chatDestination} >gg</button>
                  <Messages isOpen={isOpen} /> */}
              </div>
          </div>
        ))
      }
    </div>
  )
}
