import axios from "axios"
import { useEffect, useState } from "react"
import { Chat } from "./Chat";
// import RoomCon
import { useRoom } from '@/context/RoomsContext';


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

  const [selectedChat, setSelectedChat] = useState<{}>([]);
  const [newChats, setNewChats] = useState<Chat[]>()
  const [newRooms, setNewRooms] = useState<Room[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [rooms, setRooms] = useState<roomUsers[]>([])
  const [contacts, setContacts] = useState<Contact[]>()
// 


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
                console.log('new chat', newChat)
            
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
                  roomPass: res.data.roomPass,
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
        fetchChatUsers()
    }, [chats, rooms])

    // useEffect(() => {
    // }, [rooms])

  
  // useEffect(() => {
  //   onValueChange(selectedChat);
  // }, [selectedChat]);


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
          console.log('srrsrrr', newChats)
        
          setContacts(_contacts);

        }
        
        sortContacts()
    }, [newChats, newRooms]);

    

    // useEffect(() => {
    
    //   chatData?._socket?.on('sorting', () => {
    //     console.log('wewewewewewewewewewewe')
    //     sortChats()
    //   });
    //   return () => {
    //     chatData?._socket?.off('sorting');
    //   };
    // }, [sortChats]);


    const handleClick = (chat: any, type: string) => {
      setSelectedChat({chat, type});
      onValueChange({chat, type})
      console.log('chats chat', chat)
    };

    // useEffect(() => {
      
    //   console.log('room : ', contextRoom)
    //   // chatData?._socket?.on('newRoom', (room: Room) => {
    //   //   if (newRooms.find(r => r.id === room.id) === undefined) {
    //   //     const newRoom: Room = {
    //   //       id: room.id,
    //   //       roomName: room.roomName,
    //   //       roomAvatar: room.roomAvatar,
    //   //       roomType: room.roomType,
    //   //       latestMessageDate: 'latestMessageDate',
    //   //       latestMessageContent: 'latestMessageContent',
    //   //       type: 'room',
    //   //       roomPass: room.roomPass,
    //   //     };
    //   //     setNewRooms([...newRooms, newRoom])
    //   //   }
    //   // });
    
    //   chatData?._socket?.on('leavingRoom', (room: Room) => {
    //     console.log('WAACHA DKHOLTII?????????')
    //     if (newRooms.find(r => r.id === room.id) !== undefined)
    //       setNewRooms(prevMembers => prevMembers.filter(r => r.id !== room.id))
    //   });

    //   return () => {
    //     chatData?._socket?.off('newRoom');
    //     chatData?._socket?.off('leavingRoom');
    //   };

    // }, [chatData?._socket]);


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
      console.log('WAACHA DKHOLTII?????????', roomId, owner)
      if (newRooms.find(r => r.id === roomId) !== undefined && _MAIN_USER_.id === owner) {
        console.log('Maalna', roomId, newRooms)
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
      console.log('SRSRSRSRSRSRSRSRS', newChats)
    
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

    // useEffect(() => {
      
  
    //     return () => {
    //     };
    // }, []);
  

    // console.log('Contacts ', chats)


    return (
        <div className="chats">
          {
            contacts?.map((contact: Contact, index: number) => (
              <div className="userChats" key={index} onClick={() => handleClick(contact, contact.type)}>
                <div className="chatAvatar">
                  <img className="avatar-img" src={ contact?.receiver ? contact?.receiver?.avatar : `http://localhost:8000/room/roomAvatar/${contact.id}`  } alt="user_avatar" />
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
