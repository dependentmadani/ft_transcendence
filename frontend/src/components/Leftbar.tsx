import { useEffect, useState } from "react"
import { Navebar } from "./Navebar"
import { Search } from "./Search"
import axios from "axios"

// import { Messages } from "./Messages";

interface Chat {
  chatId: number,
  recId: number;
  msg: string;
}

interface User {
  id: number;
  username: string;
  avatar: string,
}

interface Message {
  textContent: string
}

interface ChildComponentProps {
  onValueChange: (val: Chat) => any;
}

const _MAIN_USER_: number = 1 // for now

export  const Leftbar: React.FC<ChildComponentProps> = ({ onValueChange }: any) => {
  // const [inputValue, setInputValue] = useState();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [users, setUsers] = useState<User[]>([])
  const [chats, setChats] = useState<Chat[]>([])


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

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/chat/${_MAIN_USER_}`)
        setChats(response.data)
      }
      catch (err) {
        console.error('Error fetching chats: ', err)
      }
    }
    fetchChats()
  }, [])

  useEffect(() => {
    // setInputValue(selectedChat?.msg ?? ""); // Use optional chaining and nullish coalescing
    onValueChange(selectedChat);
  }, [selectedChat]);
  


  // const handleClick = (chatId: number): any => {
  //   setSelectedChat(chatId)
  // }

  const handleClick = (chat: Chat) => {
    setSelectedChat(chat);
    onValueChange(chat)
  };

  // const [latestMessages, setLatesetMessages] = useState()

  const latestMessage = async (chatId: number) : Promise<any> => {
    try {
      const latestMessage = (await axios.get(`http://localhost:8000/message/${chatId}`))?.data
      console.log('liwazzzz -> ', latestMessage[latestMessage.length-1].textContent)
        // return await axios.get(`http://localhost:8000/message/${chatId}`).data
      return latestMessage[latestMessage.length-1]
    }
    catch (err) {
        console.log(`Couldn't fetch any message`)
      }
  }

  // console.log('lastest message: ', latestMessage(1))

  return (
    <div className="leftSidebar">
        {/* <Navebar /> */}
        <Search />
        <div className="chats">
        {
          chats.map((chat, index) => (
            <div className="userChats" key={index} onClick={() => handleClick(chat)} >
                {/* <img src={ users.find(_u => _u.id === chat?.recId)?.avatar } alt="user_avatar" /> */}
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV73Nl_MHzYV13X62NIRC8IX6FT6fenPinqCSSOS0HTQ&s" alt="" />
                <div className="userChatInfo">
                    <span>{users.find(_u => _u.id === chat?.recId)?.username }</span>
                    <p>{ 1 ? latestMessage(chat.chatId)?.textContent : 'latest message' }</p>
                    {/* <button onClick={chatDestination} >gg</button>
                    <Messages isOpen={isOpen} /> */}
                </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
