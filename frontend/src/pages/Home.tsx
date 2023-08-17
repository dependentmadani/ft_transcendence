import { Chat } from "../components/Chat"
import { Rightbar } from "../components/Rightbar"
import { Leftbar } from "../components/Leftbar"

export const Home = () => {
  return (
    <div className='home'>
        <div className='container'>
            <Leftbar />
            <Chat />
            <Rightbar />
        </div>
    </div>
  )
}
