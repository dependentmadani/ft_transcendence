import { useEffect, useState } from "react"
import axios from "axios"
import { Messages } from './Messages/Messages'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faFaceSmile } from '@fortawesome/free-solid-svg-icons';



interface Message {}

export const Input = ({ chatData, chat }: any) => {

  const currentChat = chatData._chat?.chat

  // console.log('!!!!!!!!!', currentChat)

  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Message | null>([])
  const [connectedSocket, setConnectedSocket] = useState(false)

  const createNewMessage = async (inputText: string) => {
    try {
      const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
      const sender = currentChat?.chatUsers[0] === _MAIN_USER_.id ? currentChat?.chatUsers[0] : currentChat?.chatUsers[1];
      const receiver = currentChat?.chatUsers[0] === _MAIN_USER_.id ? currentChat?.chatUsers[1] : currentChat?.chatUsers[0];
      console.log('WA L ID ', currentChat?.chatId, sender, receiver)
      let type: string = ''
      if (currentChat.type === 'chat')
        type = 'chat'
      else if (currentChat.type === 'room')
        type = 'room'
      console.log('TYPPPPEEE', chatData._chat.type)

      if (chatData._chat.type === 'chat') {
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
        const res = await axios.post(`http://localhost:8000/message/${chatData._chat.type}`, {
          'msgRoomId': currentChat?.chatId,
          'MessageSenId': sender,
          'textContent': inputText,
          'type': chatData._chat.type,
          // 'MessageRecId': receiver,
        }, {
          withCredentials: true
        })
        console.log('MSG ROOM CREATED SUCC ', res)
      }
    }
    catch
    {
      console.log(`Couldn't create new Message`)
    }
  }

  const handleClick = () => {
    if (inputText.trim() !== '') {
      createNewMessage(inputText)
      chatData._socket?.emit("newMessage", inputText);
      setInputText('')
      
      const newMessage = {
        textContent: inputText,
        msgChatId: currentChat?.chatId,
      };
      setMessages([...messages, newMessage]);
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

      const newMessage = {
        textContent: inputText,
        msgChatId: chatData._chat?.chatId,
      };
      setMessages([...messages, newMessage]);
    }
  };
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV73Nl_MHzYV13X62NIRC8IX6FT6fenPinqCSSOS0HTQ&s"
  useEffect(() => {
    chatData._socket.emit('setup', chatData._user)
    chatData._socket.on('connected', () => setConnectedSocket(true))
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (currentChat.chatId !== undefined)
            setMessages((await axios.get(`http://localhost:8000/message/chat/${currentChat?.chatId}`, {withCredentials: true}))?.data)
      }
      catch (err) {
          console.log(`No message`)
        }
    }
    fetchMessages()
  }, [currentChat?.chatId])

  console.log('WAWAW', messages)

  
  return (
    <>
    <Messages messages={ messages } />

    <div className="input">
      <div className="inputContainer">
        <input type="text" placeholder="Type something..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} />
        <div className="send">
          {/* <img src={Attach} alt="" />
          <input type="file" style={{ display: "none" }} id="file" />
          <label htmlFor="file">
            <img src={Img} alt="" />
          </label> */}
          {/* <button >Send</button> */}
          <span><FontAwesomeIcon icon={faFaceSmile} /></span>
          <span><FontAwesomeIcon icon={faPaperPlane} onClick={handleClick} /></span>
        </div>
      </div>
    </div>
    </>
  )
}
