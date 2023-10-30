import { useEffect, useState } from "react"
import { Message } from "./Message"
import axios from "axios"


interface Message {}

export const Messages = ({ chatData, messages }: any) => {


  useEffect(() => {
    const checkUserPermission = async () => {

      if (chatData?._chat?.type === 'room') {
        try {
          const _MAIN_USER_ = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})
          const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/role/${chatData?._chat?.chat?.id}/${_MAIN_USER_?.data?.id}`, { withCredentials: true })
          
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



  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {

    const checkAllow = async () => {

      if (chatData?._chat?.type === 'room') {
        const _MAIN_USER_ = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
        const allwd = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/role/${chatData?._chat?.chat?.id}/${_MAIN_USER_.id}`, { withCredentials: true })
        if (allwd.data[0].allowed !== true)
          setIsAllowed(false)
        else
          setIsAllowed(true)
      }
      else
        setIsAllowed(true)
    }

    checkAllow()

  }, [chatData?._chat?.chat?.id])


  // console.log('MESSAGES', chatData?._chat)
  return (
    <div className={ `messages  ${isAllowed === false && 'not-allowed'}` }>
      { 
        isAllowed && messages?.map((message: Message, index:number) => (
          <Message key={ index } currentMessage={ message } />
        ))
      }
    </div>
  )
}
