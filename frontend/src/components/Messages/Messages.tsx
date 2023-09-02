// import { useEffect, useState } from "react"
import { Message } from "./Message"
// import axios from "axios"

interface Message {
  messageId: number;
  textContent: string;
  msgChatId: number,
}

export const Messages = ({ messages }: any) => {
  return (
    <div className="messages">
      {
        messages.map((message: any) => (
          <Message key={ message.messageId } currentMessage={message} />
          ))
        }
    </div>
  )
}
