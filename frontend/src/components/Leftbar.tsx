import { Search } from "./Search/Search"
import { Chats } from "./Chats/Chats";

export  const Leftbar = ({ onValueChange }: any) => {
      
  // console.log('what wronkk1', onValueChange)

  return (
    <div id='leftSidebar' className="leftSidebar">
        {/* <Search /> */}
        <Chats onValueChange={onValueChange} />
    </div>
  )
}
