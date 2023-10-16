import '../css/navBarOne.css'
import { Link, useNavigate } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import { useClient } from '../client/clientContext';
import axios from 'axios';
import Client from '../client/client';


function NavBarOne() {
    
    const { client, updateClient }  = useClient();
    const [listItems, setListItems] = useState<JSX.Element>();
    // const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [orientation, setOrientation] = useState<number>(window.orientation);
    // const location = useLocation();

    
    const open =  document.querySelector('.drop-menu') as HTMLElement;

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


    const toggleMenu = () => {
        console.log('hlwa')
        if (!open)
            return ;
        if (!isMenuOpen)
            open.style.height = '0px';
        else {
            if (window.innerWidth <= 800) {
                setListItems(
                    <>
                        <li key="home"> <Link to='/' > Home </Link> </li>
                        <li key="profile"> <Link to='/profile' > Profile </Link> </li>
                        <li key="chat"> <Link to='/chat'> Chat </Link> </li>
                        <li key="play"> <Link to='/play' > Play </Link> </li>
                        <li key="settings"> <Link to='/settings' > Settings </Link> </li>
                        <li key="logout" id="logout" onClick={handleLogout} >  LogOut </li>
                    </>)
                open.style.height = '250px'
            } else {
                    setListItems(<li key="logout" id="logout"  onClick={handleLogout} >  LogOut  </li>)
                    open.style.height = '50px'
            }
        }
    };

    const handleOrientationChange = () => { 
        toggleMenu();
        setOrientation(window.orientation);
    };

    useEffect(() => {

        toggleMenu();
        window.addEventListener('resize', handleOrientationChange);
        return () => {
          window.removeEventListener('resize', handleOrientationChange);
        };
    //     };
      }, [isMenuOpen, orientation]);

    // useEffect(() => {
    //     toggleMenu();
    // }, [isMenuOpen])

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
                    <img className='user-img' src={client.avatar} alt="user-img" onClick={() => {setIsMenuOpen(!isMenuOpen)}} />
                    }
                    {/* <div className='menu-ico' onClick={toggleMenu}>
                        <FontAwesomeIcon icon={!isMenuOpen ? faBars : faAnglesLeft} />
                    </div> */}
                    <div className={`drop-menu`}>
                        {listItems}
                    </div>
                </nav>
            </>
    )
}

export default NavBarOne;