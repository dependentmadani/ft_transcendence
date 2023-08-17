
import { Chats } from "./Chats"
import { Navebar } from "./Navebar"
import { Search } from "./Search"

export const Leftbar = () => {
  return (
    <div className="sidebar">
        <Navebar />
        <Search />
        <Chats />
    </div>
  )
}
