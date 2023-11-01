import { useEffect, useState } from "react"
import { Chat } from "@/components/Chat/Chats/Chat"
import { Rightbar } from "@/components/Chat/Rightbar"
import { Leftbar } from "@/components/Chat/Leftbar"
import io, { Socket } from 'socket.io-client';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import './style.css'

// interface User {
//   id: number,
// }

// interface Message {
//   messageId: number,
//   textContent: string,
//   msgRoomId: number,
//   msgChatId: number,
//   type: string,
// }

export const HomeChat = () => {

  const [mainUser, setMainUser] = useState<User | null>(null)
  const [selectedChat, setSelectedChat] = useState<any>();
  const [selectedReceiver, setSelectedReceiver] = useState<User | null>();
  const [socket, setSocket] = useState<Socket>()
  const [showChat, setShowChat] = useState(true);
  const [showInfos, setShowInfos] = useState(false);

  

  
  useEffect(() => {

    const fetchMainUser = async () => {
      setMainUser((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data)
      // let chats: Chat[] = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/all-contacts/1/2`, {withCredentials: true})).data
      // console.log('Chats', chats)
    }
    
    const _socket: any = io(`http://${import.meta.env.VITE_BACK_ADDRESS}/chat`);
    setSocket(_socket)
    
    fetchMainUser()

    return () => {
      socket?.disconnect()
    }
  }, []); 

  const chatData = { _chat: selectedChat, _socket: socket, _mainUser: mainUser, _receiver: selectedReceiver }

  useEffect(() => {

    const getMain = async () => {
      const res = await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})
      socket?.emit('someEvent', res.data?.id);
    }
    getMain()

    return () => {
      socket?.off('someEvent');
    }
  }, [socket]);

  

  const [messages, setMessages] = useState<Message[]>([])
  
  const handleSelectedChat = async (chat: any) => {
    setSelectedChat(chat)
    chatData._chat = chat

    console.log('chat', chat)
    
    // const receiverId = chat.chat.chatUsers[0] === mainUser?.id ? chat.chat.chatUsers[1] : chat.chat.chatUsers[0];
    const receiver = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/globalSearch/${chat.name}`, {withCredentials: true})).data[0];
    console.log('receiver', receiver)
    setSelectedReceiver(receiver)
    chatData._receiver = receiver
  }

  
  useEffect(() => { 
    const fetchMessages = async () => {
      try {
        if (chatData?._chat?.type) {
          // let msg: Message[]
          console.log('selected chat', chatData?._chat?.type)
          // if (selectedChat.type === 'chat')
          //   setMessages((await axios.get(`http://localhost:8000/message/${selectedChat?.type}/${selectedChat?.chat?.chatId}`, {withCredentials: true})).data)
          // else if (selectedChat.type === 'room')
          const msssg = (await axios.get(`http://localhost:8000/message/${chatData?._chat?.type}/${chatData?._chat?.id}`, { withCredentials: true })).data
          setMessages(msssg)
          console.log('msmsmsmsmsmsms', msssg)
          }
      } 
      catch (err) {
        console.log(`No message`)
      }
    }

    fetchMessages()
  }, [ selectedChat ])

  


  const messageListener = (message: any) => {
    console.log('Yoo', message)
    if (message.type === 'Chat' && (chatData?._chat?.id === message.msgChatId) && messages.find(m => m.messageId === message.messageId) === undefined)
      setMessages([...messages, message])
    else if (message.type === 'Room' && (chatData?._chat?.id === message.msgRoomId) && messages.find(m => m.messageId === message.messageId) === undefined)
      setMessages([...messages, message])
    // chatData?._socket?.emit('sortChats')
  }

 
  useEffect(() => {
    
    chatData?._socket?.on('receiveMessage', messageListener);

      return () => {
        chatData?._socket?.off('receiveMessage');
      };
  }, [messageListener]);


  const handleDotsClick = () => {
    setShowChat(false);
    setShowInfos(true);
  };

  const handleReturnClick = () => {
    setShowChat(true);
    setShowInfos(false);
  };

 

  

  console.log(chatData)

  return (
    <div className='home'>
        <div className='container'>
        <div className="chat-nav-container">
          {selectedChat === undefined && <div className='chat-nav-item'><Leftbar onValueChange={handleSelectedChat} chatData={chatData} /></div>}
          
          {selectedChat && showChat && (
            <div className='chat-nav-item'>
              <div className="chat-nav-header">
                <div className="chat-nav-header-leftSide">
                  <a className="chat-nav-header-items" href="/chat" onClick={handleReturnClick}><FontAwesomeIcon icon={faArrowLeft} /></a>
                  <img className="chat-nav-header-avatar" src={chatData?._chat?.type === 'chat' ? chatData?._chat?.avatar : chatData?._chat?.avatar } alt="user_avatar" />
                </div>
                <div className="chat-nav-header-rightSide">
                  <a className="chat-nav-header-items" onClick={handleDotsClick}><FontAwesomeIcon icon={faEllipsisV} /></a>
                </div>
              </div>
              <Chat chatData={chatData} messages={ messages } />
            </div>
          )}

          {showInfos &&
            <div className='chat-nav-item'>
              <div className="chat-nav-header">
                <a className="chat-nav-header-items" onClick={handleReturnClick}><FontAwesomeIcon icon={faArrowLeft} /></a>
              </div>
              <Rightbar chatData={chatData} />
            </div>}
        </div>
        <div className="normal-mode">
          <Leftbar onValueChange={handleSelectedChat} chatData={ chatData } />
          <Chat chatData={ chatData } messages={ messages } />
          <Rightbar chatData={ chatData } />
        </div>
        </div>
    </div>
  )
}
