import { useEffect, useState } from "react"
import axios from "axios"
import { Messages } from './Messages/Messages'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faFaceSmile } from '@fortawesome/free-solid-svg-icons';

const _MAIN_USER_ = 1 // for now

interface Message {}

export const Input = ({ chatData, chat }: any) => {

  const currentChat = chatData._chat?.chat

  // console.log('!!!!!!!!!', currentChat)

  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Message | null>([])
  const [connectedSocket, setConnectedSocket] = useState(false)

  const createNewMessage = async (inputText: string) => {
    try {
      const sender = currentChat?.chatUsers[0] === _MAIN_USER_ ? currentChat?.chatUsers[0] : currentChat?.chatUsers[1];
      const receiver = currentChat?.chatUsers[0] === _MAIN_USER_ ? currentChat?.chatUsers[1] : currentChat?.chatUsers[0];
      console.log('WA L ID ', currentChat?.chatId, sender, receiver)

      return await axios.post('http://localhost:8000/message', {
        'MessageSenId': sender,
        'MessageRecId': receiver,
        'textContent': inputText,
        'msgChatId': currentChat?.chatId,
      })
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

  useEffect(() => {
    chatData._socket.emit('setup', chatData._user)
    chatData._socket.on('connected', () => setConnectedSocket(true))
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
          setMessages((await axios.get(`http://localhost:8000/message/${currentChat?.chatId}`))?.data)
      }
      catch (err) {
          console.log(`Couldn't fetch any message`)
        }
    }
    fetchMessages()
  }, [currentChat?.chatId])

  // console.log('WAWAW', currentChat?.chatId)

  
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
          <span onClick={handleClick}><FontAwesomeIcon icon={faPaperPlane} /></span>
        </div>
      </div>
    </div>
    </>
  )
}
