import { useEffect, useState } from "react"
import { Input } from '../Input'
import { PromptPassword } from "../Rooms/PromptPassword"
import axios from "axios"
import { Messages } from "../Messages/Messages"
// import { useAllow } from '@/context/AllowContext';

// interface Chat {}

// interface Message {
//   messageId: number,
//   textContent: string,
//   msgRoomId: number,
//   msgChatId: number,
//   type: string,
// }

export const Chat = ({ chatData, messages }: any) => {

  const [isPrivate, setIsPrivate] = useState(true)
  const [showForm, setShowForm] = useState(false);
  // const [isAllowed, updateAllow] = useState(false);
  // const [chatMessages, setChatMessages] = useState<Message[]>([])
  // const [roomMessages, setRoomMessages] = useState<Message[]>([])
  // const [contextAllow] = useAllow();

  // console.log('Hi n time')
  
  // useEffect(() => {
  //   const fetchChatMessages = async () => {
  //     try {
  //       if (chatMessages.length === 0) {
  //         const messages = (await axios.get(`http://localhost:8000/message/${chatData._chat.type}/${chatData?._chat?.chat?.chatId}`, {withCredentials: true})).data
  //         setChatMessages(messages)
  //         console.log('Socket', chatData?._socket, chatMessages.length, messages)
  //       }
  //     }
  //     catch (err) {
  //         console.log(`No message`)
  //     }
  //   }

  //   fetchChatMessages()
  // }, [])

  // console.log('Messages', messages)

  // const currentChat = chatData?._chat?.chat
  
  useEffect(() => {
    const checkAllow = async () => {

      if (chatData?._chat?.type === 'Room') {
        // const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
        const isAllowed = (await axios.get(`http://localhost:8000/roomUsers/is-allowed/${chatData?._chat?.id}/${chatData._mainUser.id}`, { withCredentials: true })).data
        console.log('Is allowed', isAllowed)
        if (isAllowed)
        {
          setIsPrivate(true)
          setShowForm(false);
        }
        else {
          setShowForm(true)
          setIsPrivate(false);
        }
        // console.log('-------', allwd.data[0].allowed, 'AYOOOOooo', showForm)
      }
    }

    checkAllow()

    console.log('selceted Chat', isPrivate)
  }, [ chatData ])
  
  

  useEffect(() => {
    if (chatData?._chat?.chat?.roomType === 'Private') {
      setIsPrivate(true);
    } else {
      setIsPrivate(false);
    }
  }, [chatData?._chat?.chat?.id]);

  const openForm = () => {
    if (showForm === false)
      setShowForm(true);
    else
      setShowForm(false)
  };

  // const setAllowing = () => {
  //   setIsAllowed(true)
  //   setIsPrivate(false);
  // }


  // const chatMessageListener = (message: any, rec: number) => {
  //   // const message = data.message
  //   // const rec = data.rec
  //   console.log('DATAAAA', message, rec)
  //   console.log(chatData?._chat?.chat?.chatId, 'vs' ,message.msgChatId)
  //   if (message.type === 'chat' && (chatData?._chat?.chat?.chatId === message.msgChatId) && chatMessages.find(m => m.messageId === message.messageId) === undefined)
  //     setChatMessages([...chatMessages, message])
  //   chatData?._socket?.emit('sortChats')
  // }

  // const roomMessageListener = (message: any) => {
  //   if (message.type === 'room' && roomMessages.find(m => m.messageId === message.messageId) === undefined)
  //     setRoomMessages([...roomMessages, message])
  //   chatData?._socket?.emit('sortChats')
  // }


  // useEffect(() => {
    
  //   // chatData?._socket?.on('sendMessage', messageListener);
  //   chatData?._socket?.on('sendMessage', chatMessageListener);
  //   chatData?._socket?.on('sendRoomMessage', roomMessageListener);

  //     return () => {
  //       chatData?._socket?.off('sendMessage');
  //     };
  // }, [chatMessageListener, roomMessageListener]);
  
  

  
 

  // useEffect(() => {
  //   const fetchRoomMessages = async () => {
  //     try {
  //         if (currentChat.id !== undefined) {
  //           let roomMessages: Message[] = (await axios.get(`http://localhost:8000/message/${chatData._chat.type}/${currentChat?.id}`, { withCredentials: true }))?.data
  //           if (roomMessages !== undefined)
  //             setRoomMessages(roomMessages)
  //         }
  //     }
  //     catch (err) {
  //         console.log(`No message`)
  //     }
  //   }

  //   fetchRoomMessages()
  // }, [chatData?._chat?.chat?.id])

  console.log('show from', showForm, 'is allowed', isPrivate) 

  // console.log('HA LIWSAL', chatData)

  return (
    <div id='Conversation' className={`chat`}>
      { showForm && <PromptPassword onClick={openForm} openForm={openForm} chatData={chatData} /> }
      <Messages chatData={chatData} messages={ messages/*chatData?._chat?.type === 'chat' ? chatMessages : roomMessages*/ } />
      <Input chatData={ chatData } />
    </div>
  )
}