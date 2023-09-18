import { ChatInfos } from "./Chats/ChatInfos"
import { RoomInfos } from "./Rooms/RoomInfos"

export const Rightbar = ({ chatData }: any) => {
  return (
    <div className="rightSidebar">
        { chatData && chatData?._chat?.type === 'chat' && <ChatInfos currentUser={ chatData?._user } /> }
        { chatData && chatData?._chat?.type === 'room' && <RoomInfos currentRoom={ chatData?._chat?.chat } /> }
    </div>
  )
}
