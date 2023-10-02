import axios from "axios";
import { useEffect, useState } from "react";

interface Message {
  MessageSenId: number,
  MessageRecId: number,
  textContent: string,
  createdAt: Date
}

interface User {
  id: number,
  username: string,
  avatar: string,
}

export const Message = ({ currentMessage }: any) => {

  const [sender, setSender] = useState<User>()
  const [owner, setOwner] = useState<User>()

  useEffect(() => {
    const getSender = async () => {
      try {
        setSender(await (await axios.get(`http://localhost:8000/users/${currentMessage?.MessageSenId}`, {withCredentials: true})).data)
      }
      catch (err) {
        console.log('No messages', err)
      }
    }
    getSender()
  }, [currentMessage])


  useEffect(() => {
    const getOwner = async () => {
      setOwner(await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data)
    }
    getOwner()
  }, [currentMessage])

  return (
    <div className={ `message ${currentMessage.MessageSenId === owner?.id && 'owner'}` } >
        <div className="messageInfo">
            <img src={ sender?.avatar } alt="user_avatar" />
            <span>{ new Date(currentMessage?.createdAt).getHours() } : { new Date(currentMessage?.createdAt).getMinutes() }</span>
        </div>
        <div className="messageContent">
            <p>{ currentMessage?.textContent }</p>
        </div>
    </div>
  )
}
