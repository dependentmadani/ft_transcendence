import { ChatInfos } from "./Chats/ChatInfos"
import { RoomInfos } from "./Rooms/RoomInfos"

export const Rightbar = ({ chatData }: any) => {

  console.log('chhhhat', chatData?._chat?.chat)
  return (
    <div id='RightSidebar' className="rightSidebar">
        { chatData && chatData?._chat?.type === 'chat' && <ChatInfos currentUser={ chatData?._chat?.chat } /> }
        { chatData && chatData?._chat?.type === 'room' && <RoomInfos chatData={ chatData } /> }
    </div>
  )
}
