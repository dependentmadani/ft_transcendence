import { Chats } from "./Chats/Chats";

export  const Leftbar = ({ onValueChange }: any) => {

  return (
    <div id='leftSidebar' className="leftSidebar">
        {/* <Search /> */}
        <Chats onValueChange={onValueChange} />
    </div>
  )
}
