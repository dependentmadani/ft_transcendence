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
  latestMessageDate: string,
  latestMessageContent: string,
}

interface Room {
  id: number,
  
  roomName: number,
  roomAvatar: string,
  roomType: string,
  latestMessageDate: string,
  latestMessageContent: string,
}

interface roomUsers {
  id: number,
  roomId: number,
  userId: number,
}

interface Contact {
  id: number,
  name: string,
  avatar: string,
  type: string,
  latestMessage: string,
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
  // const [initialChats, setInitialChats] = useState<Chat[]>()
  const [newChats, setNewChats] = useState<Chat[]>()
  const [newRooms, setNewRooms] = useState<Room[]>()
  const [chats, setChats] = useState<Chat[]>([])
  const [rooms, setRooms] = useState<roomUsers[]>([])
  const [latestMessages, setLatestMessages] = useState<{ [id: number]: {type: string, content: string, date: Date} }>({});
  const [latestRoomMessages, setLatestRoomMessages] = useState<{ [id: number]: {type: string, content: string, date: Date} }>({});
  // const [roomAvatar, setRoomAvatar] = useState('');


  
  useEffect(() => {
    const fetchChats = async () => {
      _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
      try {
        let response = await axios.get(`http://localhost:8000/chat/${_MAIN_USER_.id}`, {withCredentials: true})
        setChats(response.data)
        // console.log('GGG', response.data)
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
        // console.log('initial rooms', rooms.data, _MAIN_USER_.id)
        // let t: any = [{}]
        // // t.pop()
        // response.data.map(async (room: Room) => {
        //   let res = await axios.get(`http://localhost:8000/room/${room?.id}`, {withCredentials: true})
        //   t.push(res.data)
        // })
        // console.log('TTT', t)
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
        // console.log('HAA CHATS', chats)
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
      // console.log('HAA ROOMS', rooms)
      try {
        _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
        const newRoomsData = await Promise.all(
          rooms?.map(async (room: roomUsers) => {
            // console.log('ARRIVED ROOMS', room.id)
            // let t: any = [{}]
        // t.pop()
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
            };

            return newRoom
          })
        );
        // console.log('3LAACH 1 ', newRoomsData)
        setNewRooms(newRoomsData);
      }
      catch (err) {
        console.log('Error fetching users for rooms: ', err);
      }
    };
    fetchRoomUsers()
}, [rooms])

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
//         const _chats = await Promise.all(
//           newChats.map(async (chat) => {
//             const sender = chat.chatUsers[0] === _MAIN_USER_.id ? chat.chatUsers[0] : chat.chatUsers[1];
//             const receiver = chat.chatUsers[0] === _MAIN_USER_.id ? chat.chatUsers[1] : chat.chatUsers[0];
//             const senderResponse = await axios.get(`http://localhost:8000/users/${sender}`, {withCredentials: true});
//             const receiverResponse = await axios.get(`http://localhost:8000/users/${receiver}`, {withCredentials: true});

//             const newChat: Chat = {
//               chatId: chat.chatId,
//               chatUsers: [sender, receiver],
//               sender: senderResponse.data,
//               receiver: receiverResponse.data,
//             };
//             return newChat
//           })
//         );
//         setChats(_chats);
//       } catch (err) {
//         console.error('Error fetching users for chats: ', err);
//       }
//     };
//     fetchChats()
// }, [newChats])

  

  useEffect(() => {
    onValueChange(selectedChat);
  }, [selectedChat]);

  const handleClick = (chat: any, type: string) => {
    setSelectedChat({chat, type});
    onValueChange({chat, type})
  };

  

  

  useEffect(() => {
    const fetchChatLatestMessages = async () => {
      try {
        const chatIds = newChats?.map((chat) => chat.chatId);

        if (chatIds && chatIds.length > 0) {
          const latestMessagesData = await Promise.all(
            chatIds.map(async (chatId: number) => {
              if (chatId !== undefined) {
                const latestMessage = (await axios.get(`http://localhost:8000/message/chat/${chatId}`, {withCredentials: true}))?.data;
                const latestTextContent = latestMessage[latestMessage.length - 1]?.textContent;
                const latestTextCreatedAt: Date = latestMessage[latestMessage.length - 1]?.createdAt;
                // console.log('TYPPEEEEEEE', typeof(latestTextCreatedAt))
                return { [chatId]: { 'type': 'chat', 'content': latestTextContent, 'date': latestTextCreatedAt} };
              }
            })
          );

          const latestMessagesObject = Object.assign({}, ...latestMessagesData);
          setLatestMessages(latestMessagesObject);
        }
      } catch (err) {
        console.log('No Chat latest message');
      }
    };
    
    fetchChatLatestMessages();
  }, [newChats]);

  
  useEffect(() => {
    const fetchRoomLatestMessages = async () => {
      try {
        const roomIds = rooms?.map((room) => room.id);

        if (roomIds && roomIds.length > 0) {
          const latestMessagesData = await Promise.all(
            roomIds.map(async (roomId: number) => {
              if (roomId !== undefined) {
                const latestMessage = (await axios.get(`http://localhost:8000/message/room/${roomId}`, {withCredentials: true}))?.data;
                const latestTextContent = latestMessage[latestMessage.length - 1]?.textContent;
                const latestTextCreatedAt = latestMessage[latestMessage.length - 1]?.createdAt;
                return { [roomId]: { 'type': 'room', 'content': latestTextContent, 'date': latestTextCreatedAt} };
              }
            })
          );

          const latestMessagesObject = Object.assign({}, ...latestMessagesData);
          // console.log('UOOOOOOOOOOOOOO', latestMessagesObject)
          setLatestRoomMessages(latestMessagesObject);
        }
      }
      catch (err) {
        console.log('No Room latest messages');
      }
    };
    
    fetchRoomLatestMessages();
  }, [newRooms]);

  // useEffect(() => {
  //   const getRoomAvatar = async (id: number) => {
  //     try {
  //       const res = await axios.get(`http://localhost:8000/room/roomAvatar/${id}`, {
  //         responseType: 'arraybuffer',
  //       })
  //       const avatarData = Buffer.from(res.data, 'binary').toString('base64');
  //       const avatarUrl = `data:image/jpeg;base64,${avatarData}`;
  
  //       setRoomAvatar(avatarUrl)
  //     }
  //     catch (err) {
  //       console.log('No Avarar: ', err)
  //       // return ''
  //     }
  //   }
  //   getRoomAvatar()
  // }, [id])
  const [roomAvatar, setRoomAvatar] = useState<{ [roomId: number]: string }>({});

  useEffect(() => {
    const fetchRoomAvatars = async () => {
      try {
        const roomIds = rooms?.map((room) => room.id);

        if (roomIds && roomIds.length > 0) {
          const latestMessagesData = await Promise.all(
            roomIds.map(async (roomId: number) => {
              if (roomId !== undefined) {
                const res = (await axios.get(`http://localhost:8000/room/roomAvatar/${roomId}`, {withCredentials: true}))?.data;
                // const latestTextContent = latestMessage[latestMessage.length - 1]?.textContent;
                return { [roomId]: res || '' };
              }
            })
          );

          const latestMessagesObject = Object.assign({}, ...latestMessagesData);
          setRoomAvatar(latestMessagesObject);
        }
      } catch (err) {
        console.log('No latest messages');
      }
    };
    fetchRoomAvatars();
  }, [rooms]);

  // useEffect(() => {
  //   const fetchRoomAvatars = async () => {
  //     try {
  //       const roomAvatarUrls = await Promise.all(
  //         rooms.map(async (room) => {
  //           const res = await axios.get(`http://localhost:8000/room/roomAvatar/${room.id}`, {
  //             // responseType: 'arraybuffer',
  //             withCredentials: true,
  //           });
  //           // const avatarData = Buffer.from(res.data, 'binary').toString('base64');
  //           // const avatarUrl = `data:image/jpeg;base64,${avatarData}`;
  //           console.log('WEWWE', room.id, res.data)
  //           return { [room.id]: [res.data] || '' };
  //         })
  //         );
          
  //         // const roomAvatarMap = Object.fromEntries(
  //         //   roomAvatarUrls.map((roomAvatar) => [roomAvatar.id, roomAvatar.url])
  //         //   );
            
  //         const roomAvatarMap = Object.assign({}, ...roomAvatarUrls);
  //         setRoomAvatar(roomAvatarMap);
  //     } catch (err) {
  //       console.log('Error fetching room avatars: ', err);
  //     }
  //   };
  
  //   fetchRoomAvatars();
  // }, [rooms]);
  
  // console.log('OOO', roomAvatar)
  // console.log('Rooms', rooms)
  // newChats?.map((chat: Chat) => (
    // console.log('Room AVATAR', getRoomAvatar())
  // ))
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
    };

    setSelectedChat({chat, type})
    onValueChange({chat, type})
  }

  // console.log('HAANA', rooms)
  const [contacts, setContacts] = useState<Contact[]>()
  useEffect(() => {
    const sortContacts = async () => {
      const allChats: any = newChats || [];
      const allRooms: any = newRooms || [];

      const _contacts = allChats.concat(allRooms);
      // console.log('HMMMM', _contacts)
      // const _temp = [{...newChats, ...newRooms}]
      // const _contacts: any = await Promise.all(
      //   newChats.map(async (chat: Chat) => {
      //     // if (e !== undefined) {
      //       const latestMessage = (await axios.get(`http://localhost:8000/message/chat/${roomId}`, {withCredentials: true}))?.data;
      //       const latestTextContent = latestMessage[latestMessage.length - 1]?.textContent;
      //       const latestTextCreatedAt = latestMessage[latestMessage.length - 1]?.createdAt;
      //       return { [e.id]: { 'type': 'room', 'content': latestTextContent, 'date': latestTextCreatedAt} };
      //       // }
      //     })
      //   );
      // const sortedMessages = Object.entries(_contacts)
      // .map(([roomId, message]) => ({ roomId: parseInt(roomId), ...message })) 
      // .sort((a: any, b: any) => {
      //   const dateA: any = new Date(a.date);
      //   const dateB: any = new Date(b.date);
      //   return dateB - dateA;
      // });
      // console.log('WAAAAAAAAAAAAAW', sortedMessages)
      
      // const sortedMessagesObject = sortedMessages.reduce((acc: any, message: any) => {
      //   acc[message.roomId] = { content: message.content, date: message.date };
      //   return acc;
      // }, {});
      _contacts.sort((a: any, b: any) => {
        const dateA: any = new Date(a.latestMessageDate);
        const dateB: any = new Date(b.latestMessageDate);
        return dateA - dateB;
      });
    
      // console.log('_contacts', [_contacts])
      // Now _contacts is sorted by latestMessageDate in descending order
    
      // const sortedMessagesObject = _contacts.reduce((acc: any, message: any) => {
      //   acc[message.roomId] = { content: message.latestMessageContent, date: message.latestMessageDate };
      //   return acc;
      // }, {});
      // console.log('tempp', sortedMessagesObject)
      setContacts([_contacts]);
    }
    
    
    sortContacts()
    console.log('EWWE', contacts)
  // setLatestRoomMessages(sortedMessagesObject);
}, [newChats, newRooms]);

  return (
    <>
      <Search selectedChat={handleSelectedChat} />
      <div className="chats">
          
          {
            newChats?.map((chat: Chat, index: number) => (
              <div className="userChats" key={index} onClick={() => handleClick(chat, 'chat')}>
                <div className="chatAvatar">
                  <img src={ chat.receiver.avatar } alt="user_avatar" />
                </div>
                <div className="chatData">
                  <span>{ chat?.receiver?.username }</span>
                  <p>{ latestMessages[chat.chatId]?.content ? latestMessages[chat.chatId].content : '' }</p>
                </div>
                {/* <div className="userChatInfo">
                </div> */}
                {/* { 0 && <span className="notifSpan">n</span>} */}
              </div>
            ))
          }
          {
            newRooms?.map((room: Room, index: number) => (
              <div className="userChats" key={index} onClick={() => handleClick(room, 'room')} >
                  <div className="chatAvatar">
                    <img src={ `http://localhost:8000/room/roomAvatar/${room.id}` } alt="room_avatar" />
                  </div>
                  <div className="chatData">
                      <span>{ room.roomName }</span>
                      <p>{ latestRoomMessages[room.id]?.content ? latestRoomMessages[room.id].content : '' }</p>
                  </div>
                  {/* { 0 && <span className="notifSpan">n</span> } */}
              </div>
            ))
          }
        </div>
      </>
  )
}
