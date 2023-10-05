import axios from "axios"
import { useEffect, useState } from "react"
import { Chat } from "./Chat";
import { Search } from "../Search/Search";

interface User {
  roomId: number,
  id: number;
  username: string;
  avatar: string,
}

interface Chat {
  chatId: number,
  chatUsers: number[],
  sender: User,
  receiver: User,
  latestMessageDate: Date,
  latestMessageContent: string,
  type: string,
}

interface Room {
  id: number,
  
  roomName: number,
  roomAvatar: string,
  roomType: string,
  latestMessageDate: string,
  latestMessageContent: string,
  type: string,
}

interface roomUsers {
  id: number,
  roomId: number,
  userId: number,
}

interface Contact {
  id: number,
  name: string,
  roomName: string,
  chatName: string,
  avatar: string,
  type: string,
  latestMessageContent: string,

  // Chat
  chat: Chat,
  receiver: User,
  // Room
  room: Room,
}

var _MAIN_USER_: User

export  const Chats = ({ onValueChange }: any) => {

  const [selectedChat, setSelectedChat] = useState<{}>([]);
  const [newChats, setNewChats] = useState<Chat[]>()
  const [newRooms, setNewRooms] = useState<Room[]>()
  const [chats, setChats] = useState<Chat[]>([])
  const [rooms, setRooms] = useState<roomUsers[]>([])
  const [contacts, setContacts] = useState<Contact[]>()


  useEffect(() => {
    const fetchChats = async () => {
      _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
      try {
        let response = await axios.get(`http://localhost:8000/chat/${_MAIN_USER_?.id}`, {withCredentials: true})
        setChats(response.data)
      }
      catch (err) {
        console.log('No chats')
      }
    }
    fetchChats()
  }, [])
  
  useEffect(() => {
    const fetchRooms = async () => {
        try {
          _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
          let response = await axios.get(`http://localhost:8000/roomUsers/user/${_MAIN_USER_.id}`, {withCredentials: true})
          setRooms(response.data)
        }
        catch (err) {
          console.log('No rooms')
        }
      }
      fetchRooms()
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
                const _latestMessage = (await axios.get(`http://localhost:8000/message/chat/${chat?.chatId}`, {withCredentials: true}))?.data;
                const latestMessageDate = _latestMessage[_latestMessage.length - 1]?.createdAt;
                const latestMessageContent = _latestMessage[_latestMessage.length - 1]?.textContent;
                
                const newChat: Chat = {
                  chatId: chat.chatId,
                  chatUsers: [sender, receiver],
                  sender: senderResponse.data,
                  receiver: receiverResponse.data,
                  latestMessageDate: latestMessageDate,
                  latestMessageContent: latestMessageContent,
                  type: 'chat',
                };
            
                const chatMessages = await axios.get(`http://localhost:8000/message/chat/${chat.chatId}`, {withCredentials: true})
                if (chatMessages.data.length !== 0)
                  return newChat
                return null
              })
            );
            const filteredChatsData: any = newChatsData.filter((chat) => chat !== null);
            setNewChats(filteredChatsData);
          }
          catch (err) {
            console.log('Error fetching users for chats: ', err);
          }
        };
        fetchChatUsers()
    }, [chats])

    useEffect(() => {
      const fetchRoomUsers = async () => {
          try {
            _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
            const newRoomsData = await Promise.all(
              rooms?.map(async (room: roomUsers) => {
                let res = await axios.get(`http://localhost:8000/room/${room?.roomId}`, {withCredentials: true})
              
                const _latestMessage = (await axios.get(`http://localhost:8000/message/room/${room?.roomId}`, {withCredentials: true}))?.data;
                const latestMessageDate = _latestMessage[_latestMessage.length - 1]?.createdAt;
                const latestMessageContent = _latestMessage[_latestMessage.length - 1]?.textContent;

                const newRoom: Room = {
                  id: res.data.id,
                  roomName: res.data.roomName,
                  roomAvatar: res.data.roomAvatar,
                  roomType: res.data.roomType,
                  latestMessageDate: latestMessageDate,
                  latestMessageContent: latestMessageContent,
                  type: 'room',
                };

                return newRoom
              })
            );
            setNewRooms(newRoomsData);
          }
          catch (err) {
            console.log('Error fetching users for rooms: ', err);
          }
        };
        fetchRoomUsers()
    }, [rooms])

  
  useEffect(() => {
    onValueChange(selectedChat);
  }, [selectedChat]);


  useEffect(() => {
      const sortContacts = async () => {
        const allChats: any = newChats || [];
        const allRooms: any = newRooms || [];

        const _contacts = allChats.concat(allRooms);
        
        _contacts.sort((a: Chat, b: Chat) => {
          const dateA: any = new Date(a.latestMessageDate);
          const dateB: any = new Date(b.latestMessageDate);
          return dateB - dateA;
        });
      
        setContacts(_contacts);
      }
      
      sortContacts()
  }, [newChats, newRooms]);


  const handleClick = (chat: any, type: string) => {
    setSelectedChat({chat, type});
    onValueChange({chat, type})
  };


  const handleSelectedChat = async (_chat: any) => {
    let type='chat'
    
    const sender = _chat.chatUsers[0] === _MAIN_USER_.id ? _chat.chatUsers[0] : _chat.chatUsers[1];
    const receiver = _chat.chatUsers[0] === _MAIN_USER_.id ? _chat.chatUsers[1] : _chat.chatUsers[0];
    const senderResponse = await axios.get(`http://localhost:8000/users/${sender}`, {withCredentials: true});
    const receiverResponse = await axios.get(`http://localhost:8000/users/${receiver}`, {withCredentials: true});
    
    const chat: Chat = {
      chatId: _chat.chatId,
      chatUsers: [sender, receiver],
      sender: senderResponse.data,
      receiver: receiverResponse.data,
      latestMessageDate: _chat.latestMessageDate,
      latestMessageContent: _chat.latestMessageContent,
      type: _chat.type,
    };

    setSelectedChat({chat, type})
    onValueChange({chat, type})
  }

  
  


  return (
    <>
      <Search selectedChat={handleSelectedChat} />
      <div className="chats">
          {
            contacts?.map((contact: Contact, index: number) => (
              <div className="userChats" key={index} onClick={() => handleClick(contact, contact.type)}>
                <div className="chatAvatar">
                  <img src={ contact?.receiver ? contact?.receiver?.avatar : `http://localhost:8000/room/roomAvatar/${contact.id}`  } alt="user_avatar" />
                </div>
                <div className="chatData">
                  <span>{ contact?.roomName ? ((contact.roomName)?.length <= 8 ? contact.roomName : (contact.roomName)?.substring(0,8)+'...') : ((contact?.receiver?.username).length <= 8 ? contact?.receiver?.username : (contact?.receiver?.username).substring(0,8)+'...') }</span>
                  <p>{ contact?.latestMessageContent ? (contact?.latestMessageContent)?.length <= 8 ? contact?.latestMessageContent : (contact.latestMessageContent)?.substring(0,8)+'...' : 'No messages' }</p>
                </div>
                {/* { 0 && <span className="notifSpan">n</span>} */}
              </div>
            ))
          }
        </div>
      </>
  )
}
