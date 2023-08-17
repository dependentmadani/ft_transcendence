import axios from "axios"
import { useEffect, useState } from "react"
import { Messages } from "./Messages"

interface Message {
  MessageSenId: number,
  MessageRecId: number,
  textContent: string,
  createdAt: Date
}

export const Message = ({ messageId }) => {
  const [message, setMessage] = useState<Message[]>([])

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/message/${messageId}`)
        setMessage(response.data)
      }
      catch (err) {
        console.error(`Couldn't find any message with id ${messageId}`)
      }
    }
    fetchMessage()
  }, [])
  return (
    <div className='message owner'>
        <div className="messageInfo">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV73Nl_MHzYV13X62NIRC8IX6FT6fenPinqCSSOS0HTQ&s" alt=""  />
            
            <span>{ new Date(message?.createdAt).getMinutes() } : { new Date(message?.createdAt).getSeconds() }</span>
        </div>
        <div className="messageContent">
            <p>{ message?.textContent }</p>
            {/* <img src="https://wallpapers-clan.com/wp-content/uploads/2022/11/chopper-crying-meme-pfp-7.jpg" alt=""  /> */}
        </div>
    </div>
  )
}
