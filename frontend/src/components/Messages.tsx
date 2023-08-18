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
  // const [chats, setChats] = useState<Chat[]>([])

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

  // useEffect(() => {
  //   const fetchChats = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8000/chat')
  //       setChats(response.data)
  //     }
  //     catch (err) {
  //       console.error('Error fetching chats: ', err)
  //     }
  //   }
  //   fetchChats()
  // }, [])

  // const wantedChat = chats.find(_chat => _chat?.usrChatId === currentChat?.id)
  // const currentMessage = messages.find(_message => _message?.msgChatId === 1)
  const currentMessage = messages.filter((e) => e?.msgChatId === 1)
  console.log('wa l7maaa9 ->', messages.filter((e) => e?.msgChatId === 1))
  console.log('db chat hahia: ', currentChat)
  // console.log('7chiich ->', currentMessage)
  // console.log(messages)
  return (
    <div className="messages">
      {
        currentMessage.map((message, index) => (
          <Message currentMessage={message} />
          ))
        }
    </div>
  )
}
