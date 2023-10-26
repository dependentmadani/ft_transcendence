import { useEffect, useState } from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
// import { useAllow } from '@/context/AllowContext';

export const Input = ({ chatData }: any) => {

  const [inputText, setInputText] = useState('')
  // const [contextAllow] = useAllow();
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
        // chatData?._socket?.emit("message", msg.data);
        const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
        // const recipient = 1; // Replace with the recipient's user ID
        // const d = msg.data
        const rec = chatData?._chat?.chat?.receiver.id
        const actionEmit = chatData?._chat?.type === 'chat' ? 'message' : 'roomMessage'
        chatData?._socket.emit(actionEmit, { sender: _MAIN_USER_.id, rec: rec || null, message: msg.data });
        
        setInputText('')
      }
    }
  };

  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {

    const checkAllow = async () => {

      if (chatData?._chat?.type === 'room') {
        const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
        const allwd = await axios.get(`http://localhost:8000/roomUsers/role/${chatData?._chat?.chat?.id}/${_MAIN_USER_.id}`, { withCredentials: true })
        if (allwd.data[0].allowed !== true)
          setIsAllowed(false)
        else
          setIsAllowed(true)
        console.log('-------', allwd.data[0].allowed, 'AYOOOOooo', isAllowed)
      }
      else
        setIsAllowed(true)
    }

    checkAllow()

  }, [chatData?._chat?.chat?.id])


  // console.log('WHYY', chatData?._chat?.chat)
  return (
    <div className={`input`}>
      {/*chatData?._chat?.chat &&*/ <div className="inputContainer">
        {
          !isAllowed ? <input type="text" className="input-input" disabled placeholder="Type something..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} />
          :
          (<>
            <input type="text" className="input-input" placeholder="Type something..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} />
            <div className="send">
              {<span><FontAwesomeIcon className="send-msg-icon" icon={faPaperPlane} onClick={handleClick} /></span>}
            </div>
          </>)
        }
      </div>}
    </div>
  )
}
