import { useEffect, useState } from "react"
import axios from "axios"
import { Messages } from './Messages/Messages'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faFaceSmile } from '@fortawesome/free-solid-svg-icons';



interface Message {}

export const Input = ({ chatData, chat }: any) => {

  const currentChat = chatData?._chat?.chat
  console.log('CURRENT L3IBAT', chatData?._chat?.type)

  // console.log('!!!!!!!!!', currentChat)

  const [inputText, setInputText] = useState('')
  const [chatMessages, setChatMessages] = useState<Message | null>([])
  const [roomMessages, setRoomMessages] = useState<Message | null>([])
  const [connectedSocket, setConnectedSocket] = useState(false)

  const createNewMessage = async (inputText: string) => {
    try {
      const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
      // let type: string = ''
      // if (currentChat.type === 'chat')
      //   type = 'chat'
      // else if (currentChat.type === 'room')
      //   type = 'room'
  
      console.log('TYPPPPEEE', chatData._chat.type)
      
      if (chatData._chat.type === 'chat') {
        const sender = currentChat?.chatUsers[0] === _MAIN_USER_.id ? currentChat?.chatUsers[0] : currentChat?.chatUsers[1];
        const receiver = currentChat?.chatUsers[0] === _MAIN_USER_.id ? currentChat?.chatUsers[1] : currentChat?.chatUsers[0];
        console.log('WA L ID ', currentChat?.chatId, sender, receiver)
        
        const res = await axios.post(`http://localhost:8000/message/${chatData._chat.type}`, {
          'msgChatId': currentChat?.chatId,
          'MessageSenId': sender,
          'textContent': inputText,
          'type': chatData._chat.type,
          // 'MessageRecId': receiver,
        }, {
          withCredentials: true
        })
      }
      else if (chatData._chat.type === 'room'){
        
        console.log('HOLAAA', currentChat)
        const res = await axios.post(`http://localhost:8000/message/${chatData._chat.type}`, {
          'msgRoomId': currentChat?.id,
          'MessageSenId': _MAIN_USER_.id,
          'textContent': inputText,
          'type': chatData._chat.type,
          // 'MessageRecId': receiver,
        }, {
          withCredentials: true
        })
        console.log('MSG ROOM CREATED SUCC ', res)
      }
    }
    catch (err)
    {
      console.log(`Couldn't create new Message`, err)
    }
  }

  const handleClick = () => {
    if (inputText.trim() !== '') {
      createNewMessage(inputText)
      chatData._socket?.emit("newMessage", inputText);
      setInputText('')
      
      let newMessage: Message= {}
      if (chatData?.chat?.type === 'chat') {
        newMessage = {
          textContent: inputText,
          msgChatId: currentChat?.chatId,
        };
        setChatMessages([...chatMessages, newMessage]);
      }
      else if (chatData?.chat?.type === 'room') {
        newMessage = {
          textContent: inputText,
          msgRoomId: currentChat?.id,
        };
        setRoomMessages([...roomMessages, newMessage]);
      }
    }
  }
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // console.log('Input value on Enter:', inputText);
      if (inputText.trim() !== '') {
        createNewMessage(inputText)
        chatData._socket?.emit("newMessage", inputText);
      }
      setInputText('')

      let newMessage: Message= {}
      if (chatData?.chat?.type === 'chat') {
        newMessage = {
          textContent: inputText,
          msgChatId: currentChat?.chatId,
        };
        setChatMessages([...chatMessages, newMessage]);
      }
      else if (chatData?.chat?.type === 'room') {
        newMessage = {
          textContent: inputText,
          msgRoomId: currentChat?.id,
        };
        setRoomMessages([...roomMessages, newMessage]);
      }
    }
  };
  
  useEffect(() => {
    chatData._socket.emit('setup', chatData._user)
    chatData._socket.on('connected', () => setConnectedSocket(true))
  }, [])

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
  }, [currentChat?.chatId])

  useEffect(() => {
    const fetchRoomMessages = async () => {
      try {
          console.log('MAAAAAAAALNAAAAAAAA')
          if (currentChat.id !== undefined) {
            let roomMessages: Message[] = (await axios.get(`http://localhost:8000/message/${chatData._chat.type}/${currentChat?.id}`, { withCredentials: true }))?.data
            // console.log('WAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', roomMessages)
            if (roomMessages !== undefined)
              setRoomMessages(roomMessages)
          }
      }
      catch (err) {
          console.log(`No message`)
      }
    }
    fetchRoomMessages()
  }, [currentChat?.id])

  console.log('WAWAW', chatMessages, roomMessages)

  
  return (
    <>
    <Messages messages={ chatData?._chat?.type === 'chat' ? chatMessages : roomMessages } />

    <div className="input">
      <div className="inputContainer">
        <input type="text" placeholder="Type something..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} />
        <div className="send">
          <span><FontAwesomeIcon icon={faFaceSmile} /></span>
          <span><FontAwesomeIcon icon={faPaperPlane} onClick={handleClick} /></span>
        </div>
      </div>
    </div>
    </>
  )
}
