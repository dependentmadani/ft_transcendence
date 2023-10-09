import '../css/navBarOne.css'
import { Link, Route, Routes} from "react-router-dom"
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faAnglesLeft } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../client/authContext'
import { handleLogout } from './Logout';


function Zitona() {

    const { auth, updateAuth } = useAuth();

    const defaultList = ([
        <li key="home"> <Link to='/' className='link-b'> Home </Link> </li>,
        <li key="about"> <Link to='/about' className='link-b'> About </Link> </li>,
        <li key="developers"> <Link to='/developers' className='link-b'> Developers </Link> </li>,
        
    ])
    
    // const [listItems, setListItems] = useState([...defaultList, (    
    //     <li key="logout" id="logout" > <Link to='/home' > Get Started </Link> </li>
    //     )]
    // );

    const listItems = [
        ...defaultList,
        !auth ? (
          <li key="logout" id="logout">
            <Link to='/login'> Get Started </Link>
          </li>
        ) : (
            <li key="logout" id="logout" onClick={handleLogout}>
                 Log Out 
            </li>
        ), // You can also use an empty string ('') or any other element instead of null
      ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {

        setIsMenuOpen(!isMenuOpen)
    };

    return (

            <>
                <nav className='bar'>
                    {/* <div className='logo'>                     */}
                        <Link to='/' >
                            <img className="logo-img" src='src/imgs/mskota.png' alt='Mskota-Logo' /> 
                        </Link>
                    {/* </div> */}
                    <ul className="list">
                        {defaultList}
                    </ul>
                    <div className='login'>
                        {!auth ? <Link to='/login' > Get Started </Link> 
                          : <li key="logout" id="logout" onClick={handleLogout}> Log Out </li>}
                    </div>
                    <div className='menu-ico' onClick={toggleMenu}>
                        <FontAwesomeIcon icon={!isMenuOpen ? faBars : faAnglesLeft} />
                    </div>
                    <div className={`drop-menu ${isMenuOpen ? 'open' : ''}`}>
                        {listItems}
                    </div>
                </nav>
            </>
    )
}

export default Zitona;