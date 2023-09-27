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
  id: number,
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
  // const [roomAvatar, setRoomAvatar] = useState('');


  
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
        _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
        let rooms = await axios.get(`http://localhost:8000/roomUsers/user/${_MAIN_USER_.id}`, {withCredentials: true})
        console.log('initial rooms', rooms.data, _MAIN_USER_.id)
        let t: any = []
        rooms.data.map(async (room: Room) => {
          let res = await axios.get(`http://localhost:8000/room/${room.id}`, {withCredentials: true})
          t.push(res.data)
        })
        // console.log('TTT', t)
        setRooms(t)
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
                const latestMessage = (await axios.get(`http://localhost:8000/message/chat/${chatId}`, {withCredentials: true}))?.data;
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
        const roomIds = rooms?.map((room) => room.id);

        if (roomIds && roomIds.length > 0) {
          const latestMessagesData = await Promise.all(
            roomIds.map(async (roomId: number) => {
              if (roomId !== undefined) {
                const latestMessage = (await axios.get(`http://localhost:8000/message/room/${roomId}`, {withCredentials: true}))?.data;
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
        console.error('No latest messages');
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
  
  console.log('OOO', roomAvatar)
  console.log('Rooms', rooms)
  // newChats?.map((chat: Chat) => (
    // console.log('Room AVATAR', getRoomAvatar())
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
              {/* { 0 && <span className="notifSpan">n</span>} */}
            </div>
          ))
        }
        {
          rooms.map((room, index) => (
            <div className="userChats" key={index} onClick={() => handleClick(room, 'room')} >
                <img src={ `http://localhost:8000/room/roomAvatar/${room.id}` } alt="room_avatar" />
                <div className="userChatInfo">
                    <span>{ room.roomName }</span>
                    <p>{ latestRoomMessages[room.id] ? latestRoomMessages[room.id] : '' }</p>
                </div>
                {/* { 0 && <span className="notifSpan">n</span> } */}
            </div>
          ))
        }
      </div>
  )
}
