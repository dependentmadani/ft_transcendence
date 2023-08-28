import { Link } from "react-router-dom"

export const Navebar = () => {
  return (
    <div className="navbar">
        <ul className="navbar-ul">
          <li id='navbar-li'>
            <Link to='/'>Home </Link>
          </li>
          <li id='navbar-li'>
            <Link to='/about'>About</Link>
          </li>
          <li id='navbar-li'>
            <Link to='/devs'>Developers</Link>
          </li>
        </ul>
    </div>
  )
}
