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

const _MAIN_USER_: number = 1 // for now

export  const Chats = ({ onValueChange }: any) => {

  const [selectedChat, setSelectedChat] = useState<{}>([]);
  const [chats, setChats] = useState<Chat[]>([])
  const [newChats, setNewChats] = useState<Chat[]>()
  const [rooms, setRooms] = useState<Room[]>([])
  const [latestMessages, setLatestMessages] = useState<{ [chatId: number]: string }>({});
  const [latestRoomMessages, setLatestRoomMessages] = useState<{ [roomId: number]: string }>({});


  
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

  

  

  useEffect(() => {
    const fetchLatestMessages = async () => {
      try {
        const chatIds = newChats?.map((chat) => chat.chatId);

        if (chatIds && chatIds.length > 0) {
          const latestMessagesData = await Promise.all(
            chatIds.map(async (chatId) => {
              const latestMessage = (await axios.get(`http://localhost:8000/message/${chatId}`))?.data;
              const latestTextContent = latestMessage[latestMessage.length - 1]?.textContent;
              return { [chatId]: latestTextContent || 'No messages' };
            })
          );

          const latestMessagesObject = Object.assign({}, ...latestMessagesData);
          setLatestMessages(latestMessagesObject);
        }
      } catch (err) {
        console.error('Error fetching latest messages: ', err);
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
            roomIds.map(async (roomId) => {
              const latestMessage = (await axios.get(`http://localhost:8000/message/${roomId}`))?.data;
              const latestTextContent = latestMessage[latestMessage.length - 1]?.textContent;
              return { [roomId]: latestTextContent || 'No messages' };
            })
          );

          const latestMessagesObject = Object.assign({}, ...latestMessagesData);
          setLatestRoomMessages(latestMessagesObject);
        }
      } catch (err) {
        console.error('Error fetching latest messages: ', err);
      }
    };
    fetchLatestMessages();
  }, [rooms]);

  return (
    <div className="chats">
        {
          newChats?.map((chat: Chat, index: number) => (
            <div className="userChats" key={index} onClick={() => handleClick(chat, 'chat')}>
              <img src={chat.receiver.avatar} alt="user_avatar" />
              <div className="userChatInfo">
                <span>{chat.receiver.username}</span>
                <p>{ latestMessages[chat.chatId] }</p>
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
                    <p>{ latestRoomMessages[room.roomId] }</p>
                </div>
            </div>
          ))
        }
      </div>
  )
}
