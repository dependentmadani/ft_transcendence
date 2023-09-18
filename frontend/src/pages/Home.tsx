// import { Chat } from "../components/Chat"
import { Navebar } from "../components/Navebar"
import './home.scss'
// import { Sidebar } from "../components/Sidebar"

export const Home = () => {
  return (
    <div className='home'>
        <div className='container'>
            <Navebar/>
            Welcome home!
        </div>
    </div>
  )
}
