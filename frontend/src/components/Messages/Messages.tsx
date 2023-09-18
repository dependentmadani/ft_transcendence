// import { useEffect, useState } from "react"
import { Message } from "./Message"
// import axios from "axios"

interface Message {
  messageId: number;
  textContent: string;
  msgChatId: number,
}

export const Messages = ({ messages }: any) => {

  console.log('Messages ', messages)

  return (
    <div className="messages">
      {
        messages?.map((message: any, index:number) => (
          <Message key={ index } currentMessage={message} />
          ))
        }
    </div>
  )
}
