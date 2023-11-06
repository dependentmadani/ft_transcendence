import { useEffect, useState } from "react";
import { ChatInfos } from "./Chats/ChatInfos"
import { RoomInfos } from "./Rooms/RoomInfos"
import axios from "axios";

export const Rightbar = ({ chatData }: any) => {

  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {

    const checkAllow = async () => {

      if (chatData?._chat?.type === 'Room') {
        const allwd = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/is-allowed/${chatData._chat.id}/${chatData._mainUser.id}`, { withCredentials: true })).data
        if (allwd !== true)
          setIsAllowed(false)
        else
          setIsAllowed(true)
      }
      else
        setIsAllowed(true)
    }

    checkAllow()

  }, [ chatData ])

  //console.log('Right bar allow', isAllowed)
  
  
  return (
    <div id='RightSidebar' className="rightSidebar">
        { chatData && chatData?._chat?.type === 'Chat' && <ChatInfos chatData={ chatData } /> }
        { isAllowed && chatData && chatData?._chat?.type === 'Room' && <RoomInfos chatData={ chatData } /> }
    </div>
  )
}
