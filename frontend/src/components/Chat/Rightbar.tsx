import { useEffect, useState } from "react";
import { ChatInfos } from "./Chats/ChatInfos"
import { RoomInfos } from "./Rooms/RoomInfos"
import { useRightBar } from "@/context/RightBarContext";
import { useRightBarChat } from "@/context/rightbarChat";
import axios from "axios";

export const Rightbar = ({ chatData }: any) => {
  
  const currentRoom: Contact = chatData?._chat
  const [isAllowed, setIsAllowed] = useState(true);
  const [rightBar] = useRightBar();
  const [rightBarChat] = useRightBarChat();

  useEffect(() => {

    const checkAllow = async () => {

      if (chatData?._chat?.type === 'Room') {
        const isAdmin = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/is-admin/${currentRoom.id}/${chatData._mainUser.id}`, {withCredentials: true})).data
        if (isAdmin) {
          setIsAllowed(true);
        }
        else {
          const allwd = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/is-allowed/${chatData._chat.id}/${chatData._mainUser.id}`, { withCredentials: true })).data
          if (allwd !== true) {
            setIsAllowed(false)
          }
          else
            setIsAllowed(true)
        }
      }
      else
        setIsAllowed(true)
    }

    checkAllow()

  }, [ chatData, rightBar ])


  
  return (
    <div id='RightSidebar' className="rightSidebar">
        { rightBarChat && chatData && chatData?._chat?.type === 'Chat' && <ChatInfos chatData={ chatData } /> }
        { (isAllowed  || rightBar) && chatData && chatData?._chat?.type === 'Room' && <RoomInfos chatData={ chatData } /> }
    </div>
  )
}
