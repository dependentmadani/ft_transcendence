import { useState } from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';


export const Input = ({ chatData }: any) => {

  const [inputText, setInputText] = useState('')
  const currentChat = chatData?._chat?.chat
  

  // Creating new message eather for chats or rooms
  const createNewMessage = async (inputText: string) => {
    try {
      const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
      
      if (chatData._chat.type === 'chat') {
        const sender = currentChat?.chatUsers[0] === _MAIN_USER_.id ? currentChat?.chatUsers[0] : currentChat?.chatUsers[1];
        
        return await axios.post(`http://localhost:8000/message/${chatData._chat.type}`, {
          'msgChatId': currentChat?.chatId,
          'MessageSenId': _MAIN_USER_.id,
          'textContent': inputText,
          'type': chatData._chat.type,
        }, {
          withCredentials: true
        })
      }
      else if (chatData._chat.type === 'room'){
      
        return await axios.post(`http://localhost:8000/message/${chatData._chat.type}`, {
          'msgRoomId': currentChat?.id,
          'MessageSenId': _MAIN_USER_.id,
          'textContent': inputText,
          'type': chatData._chat.type,
        }, {
          withCredentials: true
        })
      }
    }
    catch (err)
    {
      console.log(`Couldn't create new Message`, err)
    }
  }


  // Handling message sending Click
  const handleClick = async () => {
    if (inputText.trim() !== '') {
      const msg: any = await createNewMessage(inputText)
      chatData?._socket?.emit("message", msg.data);
      chatData?._socket?.emit("contactSorting");
      setInputText('')
    }
  }
  

  // Handling message sending key
  const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (inputText.trim() !== '') {
        const msg: any = await createNewMessage(inputText)
        chatData?._socket?.emit("message", msg.data);
        chatData?._socket?.emit("contactSorting");
        setInputText('')
      }
    }
  };

  // console.log('WHYY', chatData?._chat?.chat)
  return (
    <div className="input">
      {/*chatData?._chat?.chat &&*/ <div className="inputContainer">
        <input type="text" className="input-input" placeholder="Type something..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} />
        <div className="send">
          {<span><FontAwesomeIcon icon={faPaperPlane} onClick={handleClick} /></span>}
        </div>
      </div>}
    </div>
  )
}
