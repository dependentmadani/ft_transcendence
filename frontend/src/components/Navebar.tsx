import { Link } from "react-router-dom"
import '../pages/home.scss'

export const Navebar = () => {
  return (
    <div className="navbar">
        <ul className="navbar-ul">
          <li id='navbar-li'>
            <Link to='/'>Home </Link>
          </li>
          <li id='navbar-li'>
            <Link to='/chat'>Chat</Link>
          </li>
          <li id='navbar-li'>
            <Link to='/game'>Game</Link>
          </li>
          <li id='navbar-li'>
            <Link to='/about'>About</Link>
          </li>
          <li id='navbar-li'>
            <Link to='/devs'>Developers</Link>
          </li>
          <li id='navbar-li'>
            <Link to='/Invite'> InviteGame</Link>
          </li>
        </ul>
    </div>
  )
}
