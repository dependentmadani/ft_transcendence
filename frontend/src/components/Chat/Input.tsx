import { useEffect, useState } from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';


export const Input = ({ chatData }: any) => {

  const [inputText, setInputText] = useState('')
  const [disableInput, setDisableInput] = useState(false)
  const currentChat = chatData?._chat
  

  // Creating new message eather for chats or rooms
  const createNewMessage = async (inputText: string) => {
    try {
      // const _MAIN_USER_ = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
      
      if (chatData._chat.type === 'Chat') {
        // const sender = currentChat?.chatUsers[0] === _MAIN_USER_.id ? currentChat?.chatUsers[0] : currentChat?.chatUsers[1];
        
        const _message = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/message/${chatData._chat.type}`, {
          'msgChatId': chatData?._chat?.id,
          'MessageSenId': chatData?._mainUser.id,
          'textContent': inputText,
          'type': chatData._chat.type,
        }, {
          withCredentials: true
        })
        console.log('created message', _message)
          const res = await axios.put(`http://${import.meta.env.VITE_BACK_ADDRESS}/chat/last-message/${chatData?._chat?.id}`, {
            'content': _message.data.textContent,
          }, {
            withCredentials: true
          })
          console.log('Updated chat', currentChat)
          return _message
      }
      else if (chatData._chat.type === 'room'){
      
        return await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/message/${chatData._chat.type}`, {
          'msgRoomId': currentChat?.id,
          'MessageSenId': chatData?._mainUser.id,
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
      // const _MAIN_USER_ = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
      const rec = chatData?._receiver?.id
      const actionEmit = chatData?._chat?.type === 'Chat' ? 'message' : 'roomMessage'
      chatData?._socket.emit(actionEmit, { sender: chatData?._mainUser.id, rec: rec || null, message: msg.data });
      // chatData?._socket?.emit("contactSorting");
      setInputText('')
    }
  }
  

  // Handling message sending key
  const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (inputText.trim() !== '') {
        const msg: any = await createNewMessage(inputText)
        // const _MAIN_USER_ = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
        // if (chatData?._chat?.type === 'chat') {
        //   const rec = 
        const actionEmit = chatData?._chat?.type === 'Chat' ? 'message' : 'roomMessage'
        // }
        // else if (chatData?._chat?.type === 'room')
        chatData?._socket.emit(actionEmit, { sender: chatData?._mainUser.id, rec: chatData?._receiver?.id || null, message: msg.data });
        
        setInputText('')
      }
    }
  };

  // const [isAllowed, setIsAllowed] = useState(true);

  // useEffect(() => {

  //   const checkAllow = async () => {

  //     if (chatData?._chat?.type === 'room') {
  //       // const _MAIN_USER_ = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
  //       const allwd = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/role/${chatData?._chat?.chat?.id}/${chatData?._mainUser.id}`, { withCredentials: true })
  //       if (allwd.data[0].allowed !== true)
  //         setIsAllowed(false)
  //       else
  //         setIsAllowed(true)
  //     }
  //     else
  //       setIsAllowed(true)
  //   }

  //   checkAllow()

  // }, [chatData?._chat?.chat?.id])

  useEffect(() => {
    if (chatData?._chat !== undefined)
      setDisableInput(true)
  }, [chatData?._chat])

  // console.log('input disabled', disableInput)


  return (
    <div className={`input`}>
      {/*chatData?._chat?.chat &&*/ <div className="inputContainer">
        {
          // !isAllowed ? <input type="text" className="input-input" disabled placeholder="Type something..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} />
          // :
          // (
          <>
            <input type="text" className="input-input" placeholder="Type something..." disabled={!disableInput} value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} />
            <div className="send">
              {<span><FontAwesomeIcon className="send-msg-icon" icon={faPaperPlane} onClick={handleClick} /></span>}
            </div>
          </>
          // )
        }
      </div>}
    </div>
  )
}
