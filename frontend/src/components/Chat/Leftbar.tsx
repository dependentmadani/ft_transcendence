import { Chats } from "./Chats/Chats";
import { Search } from './Search/Search';


export  const Leftbar = ({ onValueChange, chatData }: any) => {

  return (
    <div id='leftSidebar' className="leftSidebar">
        <Search onValueChange={onValueChange} chatData={ chatData } />
        <Chats onValueChange={onValueChange} chatData={ chatData } />
    </div>
  )
}
