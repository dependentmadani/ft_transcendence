import { useEffect, useState } from "react"
import Attach from "../img/attach.png"
import Img from "../img/img.png"
import axios from "axios"
// import { Message } from "./Message";
// import io, { Socket } from "socket.io-client";
// import { Message } from "./Message"
import { Messages } from './Messages/Messages'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
// interface Message {
//   messageId: number;
//   textContent: string;
//   msgChatId: number,
// }

export const Input = ({ chatData }: any) => {
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState([])
  const [connectedSocket, setConnectedSocket] = useState(false)

  const fetchMessages = async () => {
    try {    
        setMessages((await axios.get(`http://localhost:8000/message/${chatData._chat.chatId}`))?.data)
        // chatData._socket.emit('joinChat', chatData._chat?.chatId)
        // fetchMessages()
    }
    catch (err) {
        console.log(`Couldn't fetch any message`)
      }
  }
    // faFaceSmile
  const createNewMessage = async (inputText: string) => {
    try {
      return await axios.post('http://localhost:8000/message', {
        MessageSenId: chatData._chat?.senId,
        MessageRecId: chatData._chat?.recId,
        textContent: inputText,
        msgChatId: chatData._chat?.chatId,
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
        msgChatId: chatData._chat?.chatId,
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
    fetchMessages()
  }, [chatData._chat?.chatId])

  // console.log('WAWAW', messages)

  
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
          <span onClick={handleClick}><FontAwesomeIcon icon={faFaceSmile} /></span>
          <span onClick={handleClick}><FontAwesomeIcon icon={faPaperPlane} /></span>
        </div>
      </div>
    </div>
    </>
  )
}
