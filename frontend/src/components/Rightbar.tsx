
import { Navebar } from "./Navebar"
import { Search } from "./Search"
import { Infos } from "./Infos"

export const Rightbar = () => {
  return (
    <div className="sidebar">
        <Navebar />
        <Search />
        <Infos />
    </div>
  )
}
