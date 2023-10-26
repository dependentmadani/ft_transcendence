import { useEffect, useState } from "react"
import { Chat } from "@/components/Chat/Chats/Chat"
import { Rightbar } from "@/components/Chat/Rightbar"
import { Leftbar } from "@/components/Chat/Leftbar"
import io, { Socket } from 'socket.io-client';
import './style.css'
// import { RoomProvider } from "@/context/RoomsContext";
// import { AllowProvider } from "@/context/AllowContext";
import axios from "axios";
import SetInfo from "../SignUp/SignUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faChevronLeft, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
interface User {
  id: number,
}

export const HomeChat = () => {

  const [selectedChat, setSelectedChat] = useState<any>();
  const [socket, setSocket] = useState<Socket>()
  const [mainUser, setMainUesr] = useState<User>()
  

  useEffect(() => {

    const getMainUser = async () => {
        const res = await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})
        setMainUesr(res.data)
    }

    getMainUser()
  }, [socket])

  console.log('MAIN____________USER', mainUser)
  
  useEffect(() => {

    // const token = ''
    const _socket: any = io(`http://${import.meta.env.VITE_BACK_ADDRESS}/chat`);
    // _socket.emit('connect', mainUser?.id)
    // _socket.on('connect', () => {
    //   console.log('connected')
    // })
    // console.log('Yooooo', _socket);
    setSocket(_socket)

    // Listen for messages from the backend
    // socket?.on('messageFromServer', (message) => {
    //   console.log('Received message from server:', message);
    // });
    
    return () => {
      socket?.disconnect()
    }
  }, []);

  useEffect(() => {

    // let user: any
    const getMain = async () => {
      const res = await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})
      // user = res.data
      socket?.emit('someEvent', res.data?.id);
    }
    getMain()
  

    
    return () => {
      socket?.off('someEvent');
    }
  }, [socket]);
  
  const handleSelectedChat = (chat: any) => {
    setSelectedChat(chat)
    console.log('ffff', chat)
    chatData._chat = chat
  }

  const chatData = { _chat: selectedChat, _socket: socket }

  console.log('selected chat', selectedChat)
  
  // const [openIfos, setOpenInfos] = useState();

  // useEffect(() => {
  //   if ()
  //   setOpenInfos(1)
  // })
  let openIfos=false
  let openChat = true
  const setInfos = () => {
    openIfos = true
    openChat = false
    console.log('Infos state', openIfos, openChat)
  }

  const [showChat, setShowChat] = useState(true);
  const [showInfos, setShowInfos] = useState(false);

  const handleDotsClick = () => {
    setShowChat(false);
    setShowInfos(true);
  };

  const handleReturnClick = () => {
    setShowChat(true);
    setShowInfos(false);
  };


  console.log(chatData?._chat?.chat?.roomAvatar)

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
                  <img className="chat-nav-header-avatar" src={chatData?._chat?.chat.type === 'chat' ? chatData?._chat?.chat.receiver.avatar : chatData?._chat?.chat?.roomAvatar } alt="user_avatar" />
                </div>
                <div className="chat-nav-header-rightSide">
                  <a className="chat-nav-header-items" onClick={handleDotsClick}><FontAwesomeIcon icon={faEllipsisV} /></a>
                </div>
              </div>
              <Chat chatData={chatData} />
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
          <Chat chatData={ chatData } />
          <Rightbar chatData={ chatData } />
        </div>
          {/* <RoomProvider>
            <AllowProvider > */}
            {/* </AllowProvider > 
          </RoomProvider> */}
        </div>
    </div>
  )
}
