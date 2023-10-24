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
  const [showForm, setShowForm] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [roomMessages, setRoomMessages] = useState<Message[]>([])

  

  useEffect(() => {
    if (chatData?._chat?.chat?.roomType === 'Private')
    {
      setIsPrivate(true)
      setShowForm(true);
    }
    else
      setIsPrivate(false)

    console.log('selceted Chat', isPrivate)
  }, [chatData?._chat?.chat?.id])
  
  

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

  const setAllowing = () => {
    setIsAllowed(true)
    setIsPrivate(false);
  }


  const messageListener = (message: Message) => {
    if (message.type === 'chat' && chatMessages.find(m => m.messageId === message.messageId) === undefined){
      setChatMessages([...chatMessages, message])}
    else  if (message.type === 'room' && roomMessages.find(m => m.messageId === message.messageId) === undefined) {
      setRoomMessages([...roomMessages, message])}
    chatData?._socket?.emit('sortChats')
  }


  useEffect(() => {
    
    chatData?._socket?.on('sendMessage', messageListener);

      return () => {
        chatData?._socket?.off('sendMessage');
      };
  }, [messageListener]);


  

  const currentChat = chatData?._chat?.chat
  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        if (currentChat.chatId !== undefined)
          setChatMessages((await axios.get(`http://localhost:8000/message/${chatData._chat.type}/${currentChat?.chatId}`, {withCredentials: true}))?.data)
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
            let roomMessages: Message[] = (await axios.get(`http://localhost:8000/message/${chatData._chat.type}/${currentChat?.id}`, { withCredentials: true }))?.data
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

  console.log('show from', showForm, 'is allowed', isAllowed) 


  return (
    <div id='Conversation' className='chat'>
      <Messages chatData={chatData} messages={ chatData?._chat?.type === 'chat' ? chatMessages : roomMessages } />
      { isPrivate ? ( showForm && <PromptPassword onClick={openForm} setAllowing={setAllowing} openForm={openForm} chatData={chatData} />) : <Input chatData={ chatData } /> }
    </div>
  )
}
