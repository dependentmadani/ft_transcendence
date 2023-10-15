import '../css/navBarOne.css'
import { Link, useNavigate } from "react-router-dom"
import React, { useState } from 'react';
import { useClient } from '../client/clientContext';
import axios from 'axios';
import Client from '../client/client';


function NavBarOne() {

    const { client, updateClient }  = useClient();
    const navigate = useNavigate();
    // const location = useLocation();

    

    const handleLogout = async() => {
        try {
            await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logout`, 
                {withCredentials: true,}
            )
        } catch (error) {
            console.error('Error logout: ', error);
        }
        updateClient(new Client);
        navigate('/')
    }

    const defaultList: JSX.Element[] = ([
        <li key="home"> <Link to='/' className='link-b'> Home </Link> </li>,
        <li key="about"> <Link to='/about' className='link-b'> About </Link> </li>,
        <li key="developers"> <Link to='/developers' className='link-b'> Developers </Link> </li>,
    ])

    const listItems: JSX.Element[] = [
        !client.signedIn ? (
        <React.Fragment>
            {defaultList}
            <li key="getStarted">
                <Link to="/login">Get Started</Link>
            </li>
        </React.Fragment>
        ) : (
        <React.Fragment>
            <li key="profile">
                <Link to="/profile" className="link-b">  Profile </Link>
            </li>
            {defaultList}
            <li key="logout" id="logout"> Log Out </li>
        </React.Fragment>
        ),
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {

        setIsMenuOpen(!isMenuOpen)
    };

    return (

            <>
                <nav className='bar'>
                    <Link to='/' >
                        <img className="logo-img" src='src/imgs/mskota.png' alt='Mskota-Logo' /> 
                    </Link>
                    <ul className="list">
                        {defaultList}
                    </ul>
                    {!client.signedIn ?
                    <div className='login'>
                        <Link to='/login' > Get Started </Link> 
                    </div> :
                    <img className='user-img' src={client.avatar} alt="user-img" onClick={toggleMenu} />
                    }
                    {/* <div className='menu-ico' onClick={toggleMenu}>
                        <FontAwesomeIcon icon={!isMenuOpen ? faBars : faAnglesLeft} />
                    </div> */}
                    <div className={`drop-menu ${isMenuOpen ? 'open' : ''}`}>
                        {listItems}
                    </div>
                </nav>
            </>
    )
}

export default NavBarOne;