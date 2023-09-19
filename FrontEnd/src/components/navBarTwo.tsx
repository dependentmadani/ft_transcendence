import '../css/navBarTwo.css'
import { Link, Route, Routes} from "react-router-dom"
import React, { useState } from 'react';



function NavBarTwo (props:any) {


    const listItems = ([
        <li key="home"> <Link to='/' > Home </Link> </li>,
        <li key="profile"> <Link to='/profile' > Profile </Link> </li>,
        <li key="chat"> <Link to='/chat'> Chat </Link> </li>,
        <li key="play"> <Link to='/play' > Play </Link> </li>,
        <li key="settings"> <Link to='/settings' > Settings </Link> </li>,
        <li key="logout" id="logout" > <Link to='/home' > LogOut </Link> </li>
    ])

    const listNotific = ([
        <div className='notifics' ></div>,
        <div className='notifics' ></div>,
        <div className='notifics' ></div>,
        <div className='notifics' ></div>,
        <div className='notifics' ></div>,
        <div className='notifics' ></div>,
        <div className='notifics' ></div>,
        <div id='notifics' ></div>,
        <div className='notifics' ></div>
    ])

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificOpen, setIsNotificOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleNotific = () => setIsNotificOpen(!isNotificOpen);

    window.addEventListener('click', function(event) {
        const nameClass = event.target.className as string;
        if (nameClass !== 'notification' && nameClass !== 'user-img') {
            setIsMenuOpen(false)
            setIsNotificOpen(false);
        }
    });

    return ( 
        <>
            <img className='logo-img1'  src="src/imgs/logo.png" alt="Mskota-logo" />
            <div className='right-bar'>
                <img className='notification' src="src/imgs/notification.png" alt="Notification" onClick={toggleNotific} />
                <div className={`drop-notification ${isNotificOpen ? 'open-notific' : ''}`}>
                    {listNotific}
                </div>
                <img className='user-img' src="src/imgs/user.jpg" alt="user-img" onClick={toggleMenu} />
                <div className={`drop-menu2 ${isMenuOpen ? 'open-menu2' : ''}`}>
                    {listItems}
                </div>
            </div>
        </>
    )

}


export default NavBarTwo;