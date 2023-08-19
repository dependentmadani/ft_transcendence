import { Infos } from "./Infos"

export const Rightbar = ({ currentUser }: any) => {
  return (
    <div className="sidebar">
        <div className="navbar"> </div>
        {/* <Search /> */}
        <Infos currentUser={ currentUser } />
    </div>
  )
}
