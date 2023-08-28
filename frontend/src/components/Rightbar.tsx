import { Infos } from "./Infos"

export const Rightbar = ({ currentUser }: any) => {
  return (
    <div className="rightSidebar">
        <Infos currentUser={ currentUser } />
    </div>
  )
}
