import { useEffect, useState } from "react";
import { ChatInfos } from "./Chats/ChatInfos"
import { RoomInfos } from "./Rooms/RoomInfos"
import axios from "axios";

export const Rightbar = ({ chatData }: any) => {

  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {

    const checkAllow = async () => {

      if (chatData?._chat?.type === 'room') {
        const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
        const allwd = await axios.get(`http://localhost:8000/roomUsers/role/${chatData?._chat?.chat?.id}/${_MAIN_USER_.id}`, { withCredentials: true })
        if (allwd.data[0].allowed !== true)
          setIsAllowed(false)
        else
          setIsAllowed(true)
        console.log('-------', allwd.data[0].allowed, 'AYOOOOooo', isAllowed)
      }
      else
        setIsAllowed(true)
    }

    checkAllow()

  }, [chatData?._chat?.chat?.id])
  // console.log('chhhhat', chatData?._chat?.chat)
  return (
    <div id='RightSidebar' className="rightSidebar">
        { chatData && chatData?._chat?.type === 'chat' && <ChatInfos currentUser={ chatData?._chat?.chat } /> }
        { isAllowed && chatData && chatData?._chat?.type === 'room' && <RoomInfos chatData={ chatData } /> }
    </div>
  )
}
