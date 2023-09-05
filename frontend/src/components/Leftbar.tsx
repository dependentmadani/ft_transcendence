import { Search } from "./Search/Search"
import { Chats } from "./Chats/Chats";

export  const Leftbar = ({ onValueChange }: any) => {
      
  return (
    <div className="leftSidebar">
        <Search />
        <Chats onValueChange={onValueChange} />
    </div>
  )
}
