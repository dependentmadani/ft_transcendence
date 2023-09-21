import axios from "axios"
import { useEffect, useState } from "react"
import { Chat } from "./Chat";

interface User {
  id: number;
  username: string;
  avatar: string,
}

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

var _MAIN_USER_: User

export  const Chats = ({ onValueChange }: any) => {
  
  // useEffect(() => {
  //   const mainUser = async () => {
  //     const res = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
  //     _MAIN_USER_ = res.id
  //   }
  //   mainUser()
  // }, [])

  const [selectedChat, setSelectedChat] = useState<{}>([]);
  const [chats, setChats] = useState<Chat[]>([])
  const [newChats, setNewChats] = useState<Chat[]>()
  const [rooms, setRooms] = useState<Room[]>([])
  const [latestMessages, setLatestMessages] = useState<{ [chatId: number]: string }>({});
  const [latestRoomMessages, setLatestRoomMessages] = useState<{ [roomId: number]: string }>({});


  
  useEffect(() => {
    const fetchChats = async () => {
      _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
      try {
        let response = await axios.get(`http://localhost:8000/chat/${_MAIN_USER_.id}`, {withCredentials: true})
        setChats(response.data)
      }
      catch (err) {
        console.error('No chats')
      }
    }
    fetchChats()
  }, [])
  
  useEffect(() => {
      const fetchChatUsers = async () => {
        try {
          _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
          const newChatsData = await Promise.all(
            chats.map(async (chat) => {
              const sender = chat.chatUsers[0] === _MAIN_USER_.id ? chat.chatUsers[0] : chat.chatUsers[1];
              const receiver = chat.chatUsers[0] === _MAIN_USER_.id ? chat.chatUsers[1] : chat.chatUsers[0];
              const senderResponse = await axios.get(`http://localhost:8000/users/${sender}`, {withCredentials: true});
              const receiverResponse = await axios.get(`http://localhost:8000/users/${receiver}`, {withCredentials: true});

              const newChat: Chat = {
                chatId: chat.chatId,
                chatUsers: [sender, receiver],
                sender: senderResponse.data,
                receiver: receiverResponse.data,
              };
              return newChat
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
        let response = await axios.get(`http://localhost:8000/room`, {withCredentials: true})
        setRooms(response.data)
      }
      catch (err) {
        console.error('No rooms')
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

  

  

  useEffect(() => {
    const fetchLatestMessages = async () => {
      try {
        const chatIds = newChats?.map((chat) => chat.chatId);

        if (chatIds && chatIds.length > 0) {
          const latestMessagesData = await Promise.all(
            chatIds.map(async (chatId) => {
              if (chatId !== undefined) {
                const latestMessage = (await axios.get(`http://localhost:8000/message/${chatId}`, {withCredentials: true}))?.data;
                const latestTextContent = latestMessage[latestMessage.length - 1]?.textContent;
                return { [chatId]: latestTextContent || 'No messages' };
              }
            })
          );

          const latestMessagesObject = Object.assign({}, ...latestMessagesData);
          setLatestMessages(latestMessagesObject);
        }
      } catch (err) {
        console.error('No latest message');
      }
    };
    fetchLatestMessages();
  }, [newChats]);

  
  useEffect(() => {
    const fetchLatestMessages = async () => {
      try {
        const roomIds = rooms?.map((room) => room.roomId);

        if (roomIds && roomIds.length > 0) {
          const latestMessagesData = await Promise.all(
            roomIds.map(async (roomId: number) => {
              if (roomId !== undefined) {
                const latestMessage = (await axios.get(`http://localhost:8000/message/${roomId}`, {withCredentials: true}))?.data;
                const latestTextContent = latestMessage[latestMessage.length - 1]?.textContent;
                return { [roomId]: latestTextContent || 'No messages' };
              }
            })
          );

          const latestMessagesObject = Object.assign({}, ...latestMessagesData);
          setLatestRoomMessages(latestMessagesObject);
        }
      } catch (err) {
        console.error('No latest messages');
      }
    };
    fetchLatestMessages();
  }, [rooms]);

  // newChats?.map((chat: Chat) => (
  //   console.log('CHAT AVATAR', chat)
  // ))

  return (
    <div className="chats">
        {
          newChats?.map((chat: Chat, index: number) => (
            <div className="userChats" key={index} onClick={() => handleClick(chat, 'chat')}>
              <img src={ chat.receiver.avatar } alt="user_avatar" />
              <div className="userChatInfo">
                <span>{ chat.receiver.username }</span>
                <p>{ latestMessages[chat.chatId] ? latestMessages[chat.chatId] : '' }</p>
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
                    <p>{ latestRoomMessages[room.roomId] ? latestRoomMessages[room.roomId] : '' }</p>
                </div>
            </div>
          ))
        }
      </div>
  )
}
