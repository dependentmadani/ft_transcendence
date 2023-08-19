import { useEffect, useState } from "react"
import { Message } from "./Message"
import axios from "axios"

interface Message {
  messageId: number;
  textContent: string;
  msgChatId: number,
}

// interface Chat {
//   chatId: number,
//   recId: number;
//   msg: string;
//   usrChatId: number
// }

export const Messages = ({ currentChat }: any) => {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        
        setMessages((await axios.get('http://localhost:8000/message')).data)
      }
      catch (err) {
        console.log(`Couldn't fetch any message`)
      }
    }
    fetchMessages()
  }, [])

  const currentMessage = messages.filter((e) => e.msgChatId === currentChat?.chatId)

  return (
    <div className="messages">
      {
        currentMessage.map((message) => (
          <Message key={ message.messageId } currentMessage={message} />
          ))
        }
    </div>
  )
}
