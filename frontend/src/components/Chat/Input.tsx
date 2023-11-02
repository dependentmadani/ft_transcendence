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
      
      // console.log('Message', _message.data)
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

  // const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {

    const checkAllow = async () => {

      if (chatData?._chat && chatData?._chat?.type === 'Room') {
        // const _MAIN_USER_ = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
        const isAllowed = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/is-allowed/${chatData._chat.id}/${chatData?._mainUser.id}`, { withCredentials: true })).data
        if (isAllowed !== true)
          setDisableInput(false)
        else
          setDisableInput(false)
      }
      else
        setDisableInput(false)
    }

    checkAllow()
  }, [ chatData ])

  useEffect(() => {
    if (chatData._chat === undefined)
      setDisableInput(true)
    else
      setDisableInput(false)
  }, [ chatData ])

  console.log('input disabled', disableInput)


  return (
    <div className={`input`}>
      {/*chatData?._chat?.chat &&*/ <div className="inputContainer">
        {
          // !isAllowed ? <input type="text" className="input-input" disabled placeholder="Type something..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} />
          // :
          // (
          <>
            <input type="text" className="input-input" placeholder="Type something..." disabled={disableInput} value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} />
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
