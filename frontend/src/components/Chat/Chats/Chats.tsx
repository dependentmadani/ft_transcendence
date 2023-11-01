import axios from "axios"
import { useEffect, useState } from "react"
import { Chat } from "./Chat";


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
  roomName: string,
  roomAvatar: string,
  roomType: string,
  latestMessageDate: string,
  latestMessageContent: string,
  type: string,
  roomPass: string,
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
  password: string,

  // Chat
  chat: Chat,
  receiver: User,
  // Room
  room: Room,
}

var _MAIN_USER_: User

export  const Chats = ({ onValueChange, chatData }: any) => {

  // const [selectedChat, setSelectedChat] = useState<{}>([]);
  const [newChats, setNewChats] = useState<Chat[]>()
  const [newRooms, setNewRooms] = useState<Room[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [rooms, setRooms] = useState<roomUsers[]>([])
  const [contacts, setContacts] = useState<Contact[]>()
// 


  useEffect(() => {
    const fetchChats = async () => {
      _MAIN_USER_ = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
      try {
        let response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/chat/${_MAIN_USER_?.id}`, {withCredentials: true})
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
          _MAIN_USER_ = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
          let response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/user/${_MAIN_USER_.id}`, {withCredentials: true})
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
            _MAIN_USER_ = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
            const newChatsData = await Promise.all(
              chats.map(async (chat) => {
                const sender = chat.chatUsers[0] === _MAIN_USER_.id ? chat.chatUsers[0] : chat.chatUsers[1];
                const receiver = chat.chatUsers[0] === _MAIN_USER_.id ? chat.chatUsers[1] : chat.chatUsers[0];
                const senderResponse = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/${sender}`, {withCredentials: true});
                const receiverResponse = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/${receiver}`, {withCredentials: true});
                const _latestMessage = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/message/chat/${chat?.chatId}`, {withCredentials: true}))?.data;
                const latestMessageDate = _latestMessage[_latestMessage.length - 1]?.createdAt || null;
                const latestMessageContent = _latestMessage[_latestMessage.length - 1]?.textContent || null;
                
                const newChat: Chat = {
                  chatId: chat.chatId,
                  chatUsers: [sender, receiver],
                  sender: senderResponse.data,
                  receiver: receiverResponse.data,
                  latestMessageDate: latestMessageDate,
                  latestMessageContent: latestMessageContent,
                  type: 'chat',
                };
            
                const chatMessages = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/message/chat/${chat.chatId}`, {withCredentials: true})
                // We must check for blocked Users and let'em pass
                const isBlocked = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/blocked-friend/${newChat.receiver.id}`, {withCredentials: true})).data;
                if (chatMessages.data.length !== 0 && isBlocked === false)
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
        
        const fetchRoomUsers = async () => {
          try {
            _MAIN_USER_ = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
            const newRoomsData = await Promise.all(
              rooms?.map(async (room: roomUsers) => {
                let res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/room/${room?.roomId}`, {withCredentials: true})
              
                const _latestMessage = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/message/room/${room?.roomId}`, {withCredentials: true}))?.data;
                const latestMessageDate = _latestMessage[_latestMessage.length - 1]?.createdAt;
                const latestMessageContent = _latestMessage[_latestMessage.length - 1]?.textContent;
  
                const newRoom: Room = {
                  id: res.data.id,
                  roomName: res.data.roomName,
                  roomAvatar: res.data.roomAvatar,
                  roomType: res.data.roomType,
                  latestMessageDate: latestMessageDate,
                  latestMessageContent: latestMessageContent,
                  roomPass: res.data.roomPass,
                  type: 'room',
                };
  
                // Check if the user is permissible to access the channel
                const resp = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/role/${newRoom.id}/${_MAIN_USER_.id}`, {withCredentials: true})).data[0];
                if (resp.role === 'BANNED' || resp.role === 'MUTED')
                  return null
                return newRoom
              })
            );
            const filteredRoomsData: any = newRoomsData.filter((room) => room !== null);
            setNewRooms(filteredRoomsData);
          }
          catch (err) {
            console.log('Error fetching users for rooms: ', err);
          }
        };


        fetchRoomUsers()
        fetchChatUsers()
    }, [chats, rooms])




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
      // setSelectedChat({chat, type});
      onValueChange({chat, type})
    };



    const roomListener = (room: Room, owner: number) => {
      if (newRooms.find(r => r.id === room.id) === undefined && _MAIN_USER_.id == owner) {
        const newRoom: Room = {
          id: room.id,
          roomName: room.roomName,
          roomAvatar: room.roomAvatar,
          roomType: room.roomType,
          latestMessageDate: 'latestMessageDate',
          latestMessageContent: 'latestMessageContent',
          type: 'room',
          roomPass: room.roomPass,
        };
        setNewRooms([...newRooms, newRoom])
      }
    }

    const leaveRoomListener = (roomId: number, owner: number) => {
      if (newRooms.find(r => r.id === roomId) !== undefined && _MAIN_USER_.id === owner) {
        setNewRooms(prevMembers => prevMembers.filter(r => r.id !== roomId))
      }
    }
  
  
    const contactsSorting = async () => {
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
  
    useEffect(() => {
      
      chatData?._socket?.on('newRoom', roomListener);
      chatData?._socket?.on('leavingRoom', leaveRoomListener);
      chatData?._socket?.on('sortChats', contactsSorting);
  
        return () => {
          chatData?._socket?.off('newRoom');
          chatData?._socket?.off('leavingRoom');
        };
    }, [roomListener, leaveRoomListener, contactsSorting]);



    return (
        <div className="chats">
          {
            contacts?.map((contact: Contact, index: number) => (
              <div className="userChats" key={index} onClick={() => handleClick(contact, contact.type)}>
                <div className="chatAvatar">
                  <img className="avatar-img" src={ contact?.receiver ? contact?.receiver?.avatar : `http://${import.meta.env.VITE_BACK_ADDRESS}/room/roomAvatar/${contact.id}`  } alt="user_avatar" />
                </div>
                <div className="chatData">
                  <span className="contact-name">{ contact?.roomName ? ((contact.roomName)?.length <= 8 ? contact.roomName : (contact.roomName)?.substring(0,8)+'...') : ((contact?.receiver?.username).length <= 8 ? contact?.receiver?.username : (contact?.receiver?.username).substring(0,8)+'...') }</span>
                  <p className="latest-message">{ contact?.latestMessageContent ? (contact?.latestMessageContent)?.length <= 8 ? contact?.latestMessageContent : (contact.latestMessageContent)?.substring(0,8)+'...' : 'No messages' }</p>
                </div>
                {/* { 0 && <span className="notifSpan">n</span>} */}
              </div>
            ))
          }
        </div>
    )
}
