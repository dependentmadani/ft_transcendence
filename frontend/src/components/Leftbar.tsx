import { useEffect, useState } from "react"
import { Search } from "./Search/Search"
import axios from "axios"

interface Chat {
  chatId: number,
  recId: number;
  msg: string;
}

interface Room {
  roomId: number,
  roomName: number;
  roomAvatar: string;
}

interface User {
  id: number;
  username: string;
  avatar: string,
}

interface ChildComponentProps {
  onValueChange: (val: any, type: string) => any;
}

const _MAIN_USER_: number = 1 // for now

export  const Leftbar: React.FC<ChildComponentProps> = ({ onValueChange, isOpen, onClose }: any) => {
  const [selectedChat, setSelectedChat] = useState<{}>([]);
  const [users, setUsers] = useState<User[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [rooms, setRooms] = useState<Room[]>([])


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
        let response = await axios.get(`http://localhost:8000/chat/${_MAIN_USER_}`)
        setChats(response.data)
      }
      catch (err) {
        console.error('Error fetching chats: ', err)
      }
    }
    fetchChats()
  }, [])

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let response = await axios.get(`http://localhost:8000/room`)
        setRooms(response.data)
      }
      catch (err) {
        console.error('Error fetching rooms: ', err)
      }
    }
    fetchRooms()
  }, [])

  useEffect(() => {
    onValueChange(selectedChat);
  }, [selectedChat]);

  const handleClick = (chat: any, type: string) => {
    setSelectedChat({chat, type});
    onValueChange({chat, type})
  };

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

  return (
    <div className="leftSidebar">
        {/* <Navebar /> */}
        <Search />
        <div className="chats">
        {
          chats.map((chat, index) => (
            <div className="userChats" key={index} onClick={() => handleClick(chat, 'chat')} >
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
        {
          rooms.map((room, index) => (
            <div className="userChats" key={index} onClick={() => handleClick(room, 'room')} >
                <img src={ room?.roomAvatar } alt="room_avatar" />
                <div className="userChatInfo">
                    <span>{ room.roomName }</span>
                    {/* <p>{ 1 ? latestMessage(chat.chatId)?.textContent : 'latest message' }</p> */}
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
