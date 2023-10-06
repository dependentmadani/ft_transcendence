import { Chats } from "./Chats/Chats";

export  const Leftbar = ({ onValueChange, chatData }: any) => {

  return (
    <div id='leftSidebar' className="leftSidebar">
        {/* <Search /> */}
        <Chats onValueChange={onValueChange} chatData={ chatData } />
    </div>
  )
}
