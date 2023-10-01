import { useEffect, useState } from "react"
import { Message } from "./Message"
import axios from "axios"

interface Message {}

export const Messages = ({ chatData, messages }: any) => {

  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    const checkUserPermission = async () => {

      if (chatData?._chat?.type === 'room') {
        try {
          const _MAIN_USER_ = await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})
          const res = await axios.get(`http://localhost:8000/roomUsers/role/${chatData?._chat?.chat?.id}/${_MAIN_USER_?.data?.id}`, { withCredentials: true })
          // console.log('MAIN USER', _MAIN_USER_.data.id, res.data[0].role)
          res.data[0].role === 'BANNED' || res.data[0].role === 'MUTED' ? setIsAllowed(false) : setIsAllowed(true)
        }
        catch (err) {
          console.log(err)
        }
      }
      else
        setIsAllowed(true)
    }

    checkUserPermission()
  }, [chatData?._chat?.chat])

  console.log('Chaaaaaaaatdata', isAllowed)

  return (
    <div className="messages">
      { 
        isAllowed && messages?.map((message: any, index:number) => (
          <Message key={ index } currentMessage={ message } />
        ))
      }
    </div>
  )
}
