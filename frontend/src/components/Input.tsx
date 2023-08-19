import { useState } from "react"
import Attach from "../img/attach.png"
import Img from "../img/img.png"
import axios from "axios"

export const Input = ({ currentChat }: any) => {
  const [inputText, setInputText] = useState('')

  const createNewMessage = async (inputText: string) => {
    try {
      return await axios.post('http://localhost:8000/message', {
        MessageSenId: currentChat?.senId,
        MessageRecId: currentChat?.recId,
        textContent: inputText,
        msgChatId: currentChat?.chatId,
      })
    }
    catch
    {
      console.log(`Couldn't create new Message`)
    }
  }
  const handleClick = () => {
    console.log('Ha lKtaaaba: ', inputText)
    if (inputText.trim() !== '')
      createNewMessage(inputText)
  }
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log('Input value on Enter:', inputText);
      if (inputText.trim() !== '')
        createNewMessage(inputText)
      setInputText('')
    }
  };
  
  return (
    <div className="input">
      <input type="text" placeholder="Type something..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} />
      <div className="send">
        <img src={Attach} alt="" />
        <input type="file" style={{ display: "none" }} id="file" />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleClick} >Send</button>
      </div>
    </div>
  )
}
