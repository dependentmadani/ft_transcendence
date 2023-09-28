import { ChatInfos } from "./Chats/ChatInfos"
import { RoomInfos } from "./Rooms/RoomInfos"

export const Rightbar = ({ chatData }: any) => {

  console.log('what wronkk', chatData?._chat)

  return (
    <div className="rightSidebar">
        { chatData && chatData?._chat?.type === 'chat' && <ChatInfos currentUser={ chatData?._chat?.chat } /> }
        { chatData && chatData?._chat?.type === 'room' && <RoomInfos currentRoom={ chatData?._chat?.chat } /> }
    </div>
  )
}
