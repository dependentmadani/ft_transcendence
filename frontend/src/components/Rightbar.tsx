import { Infos } from "./Infos"

export const Rightbar = ({ currentUser }: any) => {
  return (
    <div className="rightSidebar">
        { currentUser && <Infos currentUser={ currentUser } /> }
    </div>
  )
}
