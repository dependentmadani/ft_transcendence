import { useEffect, useState } from "react"
import { Input } from '../Input'
import { PromptPassword } from "../Rooms/PromptPassword"
import axios from "axios"
import { Messages } from "../Messages/Messages"
import { useShow } from "@/context/ShowFormContext"
import { useRightBar } from "@/context/RightBarContext"
import { useSocket } from '@/context/socketContext';
import { useRightBarChat } from "@/context/rightbarChat";

export const Chat = ({ state, chatData, messages }: any) => {

  const currentRoom: Contact = chatData?._chat
  const [isAllowed, setIsAllowed] = useState(false)
  const [, setRightBar] = useRightBar();
  const [, setRightBarChat] = useRightBarChat();
  const [blocked, setBlocked] = useState(false);
  const [show] = useShow();
  const {socketa} = useSocket();


  useEffect(() => {
    const checkAllow = async () => {

      if (chatData?._chat?.type === 'Room') {
          const isAdmin = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/is-admin/${currentRoom.id}/${chatData._mainUser.id}`, {withCredentials: true})).data
          if (isAdmin) {
            setIsAllowed(true);
          }
          else {
            const firstAllow = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/is-allowed/${chatData?._chat?.id}/${chatData._mainUser.id}`, { withCredentials: true })).data
            if (firstAllow) {
              setIsAllowed(true);
            }
            else {
              if (chatData?._chat?.protection === 'Public') {
                const allowed = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/is-allowed/${chatData?._chat?.id}/${chatData._mainUser.id}`, { withCredentials: true })).data
                if (!allowed && state === true) {
                  setIsAllowed(true);
                  setRightBar(true);
                  
                  setBlocked(false);
                  await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers`, {
                        roomId: currentRoom.id,
                        userId: chatData._mainUser.id,
                        userUsername: chatData._mainUser.username,
                        role: 'MEMBER',
                        allowed: true,
                    },
                    {
                        withCredentials: true,
                    });
                  }
                }
                else {
                  setIsAllowed(false)
                  setBlocked(false);
              }
            }
          }
      }
      else {
        setIsAllowed(true)
        setRightBarChat(true);
      }
    }

    checkAllow()
  }, [ chatData, show ])

  useEffect(() => {
    chatData._socket?.on('lockingRoom', () => {
      setIsAllowed(false)
      setBlocked(true);
      setRightBar(false);
    })
  }, [ chatData._socket ]) 

  useEffect(() => {
    socketa?.on('lockingChat', () => {
      setIsAllowed(false)
      setBlocked(true);
      setRightBarChat(false);
      chatData?._socket?.emit('sortContacts')
    })
  }, [ socketa ])
  
 

  return (
    <div id='Conversation' className={`chat`}>
      {show === 'true' && !isAllowed && !blocked && < PromptPassword setIsAllowed={setIsAllowed}  chatData={chatData}/> }
      <Messages chatData={chatData} messages={ messages } isOk={ isAllowed } />
      <Input chatData={ chatData } isAllowed={ isAllowed } />
    </div>
  )
}