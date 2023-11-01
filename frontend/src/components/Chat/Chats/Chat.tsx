import { useEffect, useState } from "react"
import { Input } from '../Input'
import { PromptPassword } from "../Rooms/PromptPassword"
import axios from "axios"
import { Messages } from "../Messages/Messages"

interface Chat {}

interface Message {
  messageId: number,
  textContent: string,
  msgRoomId: number,
  msgChatId: number,
  type: string,
}

export const Chat = ({ chatData }: any) => {

  const [isPrivate, setIsPrivate] = useState(true)
  const [showForm, setShowForm] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [roomMessages, setRoomMessages] = useState<Message[]>([])

  
  const currentChat = chatData?._chat?.chat
  
  useEffect(() => {
    const checkAllow = async () => {

      if (chatData?._chat?.type === 'room') {
        const _MAIN_USER_ = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
        const allwd = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/role/${chatData?._chat?.chat?.id}/${_MAIN_USER_.id}`, { withCredentials: true })
        if (allwd.data[0].allowed !== true)
        {
          setIsPrivate(true)
          setShowForm(true);
        }
        else {
          setShowForm(false)
          setIsPrivate(false);
        }
      }
    }

    checkAllow()

    console.log('selceted Chat', isPrivate)
  }, [chatData?._chat?.chat?.id])
  


  const openForm = () => {
    if (showForm === false)
      setShowForm(true);
    else
      setShowForm(false)
  };


  const chatMessageListener = (message: any) => {
    
    if (message.type === 'chat' && (chatData?._chat?.chat?.chatId === message.msgChatId) && chatMessages.find(m => m.messageId === message.messageId) === undefined)
      setChatMessages([...chatMessages, message])
    chatData?._socket?.emit('sortChats')
  }

  const roomMessageListener = (message: any) => {
    if (message.type === 'room' && roomMessages.find(m => m.messageId === message.messageId) === undefined)
      setRoomMessages([...roomMessages, message])
    chatData?._socket?.emit('sortChats')
  }


  useEffect(() => {

    chatData?._socket?.on('sendMessage', chatMessageListener);
    chatData?._socket?.on('sendRoomMessage', roomMessageListener);

      return () => {
        chatData?._socket?.off('sendMessage');
      };
  }, [chatData?._socket, chatMessages, roomMessages, chatMessageListener, roomMessageListener]);


  

  
  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        if (currentChat.chatId !== undefined)
          setChatMessages((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/message/${chatData._chat.type}/${currentChat?.chatId}`, {withCredentials: true}))?.data)
      }
      catch (err) {
          console.log(`No message`)
      }
    }

    fetchChatMessages()
  }, [chatData?._chat?.chat?.chatId])

  useEffect(() => {
    const fetchRoomMessages = async () => {
      try {
          if (currentChat.id !== undefined) {
            let roomMessages: Message[] = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/message/${chatData._chat.type}/${currentChat?.id}`, { withCredentials: true }))?.data
            if (roomMessages !== undefined)
              setRoomMessages(roomMessages)
          }
      }
      catch (err) {
          console.log(`No message`)
      }
    }

    fetchRoomMessages()
  }, [chatData?._chat?.chat?.id])

  // console.log('show from', showForm, 'is allowed', isPrivate) 


  return (
    <div id='Conversation' className={`chat`}>
      { showForm && <PromptPassword onClick={openForm} openForm={openForm} chatData={chatData} /> }
      <Messages chatData={chatData} messages={ chatData?._chat?.type === 'chat' ? chatMessages : roomMessages } />
      <Input chatData={ chatData } />
    </div>
  )
}
