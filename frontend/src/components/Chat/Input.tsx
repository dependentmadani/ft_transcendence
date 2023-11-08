import { useState } from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useShow } from "@/context/ShowFormContext"


export const Input = ({ chatData, isAllowed }: any) => {

  const [inputText, setInputText] = useState('')
  const [show] = useShow();
  const currentChat = chatData?._chat
  

  const createNewMessage = async (inputText: string) => {
    try {
      
      let _message
      if (chatData._chat.type === 'Chat') {  
        _message = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/message/${chatData._chat.type}`, {
          'msgChatId': chatData?._chat?.id,
          'MessageSenId': chatData?._mainUser.id,
          'textContent': inputText,
          'type': chatData._chat.type,
        }, { withCredentials: true })
      }
      else if (chatData._chat.type === 'Room'){
      
        _message = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/message/${chatData._chat.type}`, {
          'msgRoomId': currentChat?.id,
          'MessageSenId': chatData._mainUser.id,
          'textContent': inputText,
          'type': chatData._chat.type,
        }, { withCredentials: true })

      }
      
      await axios.put(`http://${import.meta.env.VITE_BACK_ADDRESS}/${chatData._chat.type}/last-message/${chatData?._chat?.id}`, {
        'content': _message?.data.textContent,
      }, {  withCredentials: true })

      return _message?.data
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
      chatData?._socket.emit('message', { sender: chatData._mainUser.id, rec: chatData?._receiver?.id || null, message: msg });
      setInputText('') 
    }
  }
  

  // Handling message sending key
  const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (inputText.trim() !== '') {

        const msg: any = await createNewMessage(inputText)
        chatData?._socket.emit('message', { sender: chatData._mainUser.id, rec: chatData?._receiver?.id || null, message: msg });

        setInputText('')
      }
    }
  };


  return (
    <div className={`input`}>
      <div className="inputContainer">
        <input type="text" className="input-input" placeholder="Type something..." disabled={(show === 'l3washr' || ((show === 'true' || show === 'false') && !isAllowed)) ? true : false}
               value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} />
            <div className="send">
              {<span><FontAwesomeIcon className="send-msg-icon" icon={faPaperPlane} onClick={handleClick} /></span>}
            </div>
      </div>
    </div>
  )
}
