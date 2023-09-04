import { useEffect, useState } from "react"
import { Search } from "./Search/Search"
import axios from "axios"

interface Chat {
  chatId: number,
  chatUsers: number[],
  sender: User,
  receiver: User
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
  const [newChats, setNewChats] = useState<Chat[]>()
  const [rooms, setRooms] = useState<Room[]>([])
  // const [chatSender, setChatSender] = useState<User>()
  // const [chatReceiver, setChatReceiver] = useState<User>()


  
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
      const fetchChatUsers = async () => {
        try {
          const newChatsData = await Promise.all(
            chats.map(async (chat) => {
              const sender = chat.chatUsers[0] === _MAIN_USER_ ? chat.chatUsers[0] : chat.chatUsers[1];
              const receiver = chat.chatUsers[0] === _MAIN_USER_ ? chat.chatUsers[1] : chat.chatUsers[0];
              const senderResponse = await axios.get(`http://localhost:8000/users/${sender}`);
              const receiverResponse = await axios.get(`http://localhost:8000/users/${receiver}`);

              const newChat: Chat = {
                chatId: chat.chatId,
                chatUsers: [sender, receiver],
                sender: senderResponse.data,
                receiver: receiverResponse.data,
              };
              return newChat;
            })
          );
          setNewChats(newChatsData);
        } catch (err) {
          console.error('Error fetching users for chats: ', err);
        }
      };
      fetchChatUsers()
  }, [chats])

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
      // console.log('liwazzzz -> ', latestMessage[latestMessage.length-1].textContent)
        // return await axios.get(`http://localhost:8000/message/${chatId}`).data
      return latestMessage[latestMessage.length-1]
    }
    catch (err) {
        console.log(`Couldn't fetch any message`)
      }
  }

  
  // console.log('CHATS -> ', chats, ' CHAT SENDER -> ', chatSender, ' CHAT RECEIVER -> ', chatReceiver)

  console.log('HAAA', newChats)
  // newChats?.map((chat, index) => {
  //       console.log('chat', chat.chatId, 'sender', chat.chatUsers[0], 'receiver', chat.chatUsers[1])
  //     })
  
      
  return (
    <div className="leftSidebar">
        {/* <Navebar /> */}
        <Search />
        <div className="chats">
        {
          newChats?.map((chat: Chat, index: number) => (
            <div className="userChats" key={index} onClick={() => handleClick(chat, 'chat')}>
              <img src={chat.receiver.avatar} alt="user_avatar" />
              <div className="userChatInfo">
                <span>{chat.receiver.username}</span>
                <p>{/*chat.chatId ? latestMessage(chat.chatId)?.textContent : */'latest message'}</p>
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
