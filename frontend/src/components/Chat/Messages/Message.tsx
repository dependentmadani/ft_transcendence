import axios from "axios";
import { useEffect, useState } from "react";


export const Message = ({ currentMessage }: any) => {

  const [sender, setSender] = useState<User>()
  const [owner, setOwner] = useState<User>()

  useEffect(() => {
    const getSender = async () => {
      try {
        setSender(await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/${currentMessage?.MessageSenId}`, {withCredentials: true})).data)
      }
      catch (err) {
        //console.log('No messages', err)
      }
    }

    getSender()
  }, [currentMessage])


  useEffect(() => {
    const getOwner = async () => {
      setOwner(await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data)
    }
    getOwner()
  }, [currentMessage])


  return (
    <div className={ `message ${currentMessage?.MessageSenId === owner?.id && 'owner'}` } >
        <div className="messageInfo">
            <img className='msg-img' src={ sender?.avatar } alt="user_avatar" />
            <span className="msg-date">{ new Date(currentMessage?.createdAt).getHours() } : { new Date(currentMessage?.createdAt).getMinutes() }</span>
        </div>
        <div className="messageContent">
            <p className="msg-p">{ currentMessage?.textContent }</p>
        </div>
    </div>
  )
}
