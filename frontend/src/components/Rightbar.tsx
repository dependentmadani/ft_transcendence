
import { Navebar } from "./Navebar"
import { Search } from "./Search"
import { Infos } from "./Infos"

export const Rightbar = ({ currentUser }: any) => {
  return (
    <div className="sidebar">
        <Navebar />
        <Search />
        <Infos currentUser={ currentUser } />
    </div>
  )
}
