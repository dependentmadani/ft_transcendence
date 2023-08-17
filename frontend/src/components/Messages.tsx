import { useEffect, useState } from "react"
import { Message } from "./Message"
import axios from "axios"

interface Message {
  messageId: number;
  textContent: string;
}

export const Messages = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setMessages(await axios.get('http://localhost:8000/message'))
      }
      catch (err) {
        console.log(`Couldn't fetch any message`)
      }
    }
    fetchMessages()
  }, [])

  console.log('7chiich ->', chatId)

  return (
    <div className="messages">
      {/* {
        messages.map((message, index) => (
          ))
        } */}
        <Message messageId={1} />
    </div>
  )
}
