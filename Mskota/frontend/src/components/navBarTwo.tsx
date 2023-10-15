import '../css/navBarTwo.css'
import { Link, useNavigate } from "react-router-dom"
import  { useEffect, useState } from 'react';
import { useClient } from '../client/clientContext';
import Client from '../client/client';
import axios from 'axios';


function NavBarTwo (props:any) {

    // const { client } = useClient();
    const { client, updateClient }  = useClient();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [orientation, setOrientation] = useState<number>(window.orientation);
    const [isNotificOpen, setIsNotificOpen] = useState(false);
    const [listItems, setListItems] = useState<JSX.Element>();
    const navigate = useNavigate();


    const listNotific = ([
        <div className='notifics' >
            <img src="src/imgs/example.jpg" alt="hlwa" />
            <span id='notific-user' >hamid</span>
            <span id='notific-title'>Friend</span>
            <button id='accept'> </button>
            <button id='refuse'></button>
            </div>,
        <div className='notifics' ></div>,
        <div className='notifics' ></div>,
        <div className='notifics' ></div>,
        <div className='notifics' ></div>,
        <div className='notifics' ></div>,
        <div className='notifics' ></div>,
        <div id='notifics' ></div>,
        <div className='notifics' ></div>
    ])


    const toggleMenu = () => { setIsMenuOpen(!isMenuOpen) };
    const handleOrientationChange = () => { setOrientation(window.orientation);};
    const toggleNotific = () => setIsNotificOpen(!isNotificOpen);

    window.addEventListener('click', function(event) {
        const nameClass = event.target.className as string;
        if (nameClass !== 'notification' && nameClass !== 'user-img') {
            // setIsMenuOpen0(false)
            setIsMenuOpen(false)
            setIsNotificOpen(false);
        }
    });

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

    useEffect(() => {
        const handleOrientationChange = () => {
          if (window.matchMedia("(orientation: portrait)").matches) {
            setListItems(
                <>
                    <li key="home"> <Link to='/' > Home </Link> </li>
                    <li key="profile"> <Link to='/profile' > Profile </Link> </li>
                    <li key="chat"> <Link to='/chat'> Chat </Link> </li>
                    <li key="play"> <Link to='/play' > Play </Link> </li>
                    <li key="settings"> <Link to='/settings' > Settings </Link> </li>
                    <li key="logout" id="logout" onClick={handleLogout} >  LogOut </li>
                </>)
        } else 
            setListItems(<li key="logout" id="logout"  onClick={handleLogout} >  LogOut  </li>)
        };
    
        handleOrientationChange(); // Initial check
    
        window.addEventListener('resize', handleOrientationChange);
    
        return () => {
          window.removeEventListener('resize', handleOrientationChange);
        };
      }, []);
    

    return ( 
        <>
            <div className='NavBarTwo'>
                <Link to='/' >
                    <img className='logo-img1'  src="src/imgs/mskota.png" alt="Mskota-logo" />
                </Link>
                <div className='right-bar'>
                    <img className='notification' src="src/imgs/notification.png" alt="Notification" onClick={toggleNotific} />
                    <div className={`drop-notification ${isNotificOpen ? 'open-notific' : ''}`}>
                        {listNotific}
                    </div>
                    <img className='user-img2' src={client.avatar} alt="user-img" onClick={toggleMenu} />
                </div>
                <div className={`drop-menu2 ${isMenuOpen ? 'open-menu2' : ''}`}>
                    {listItems}
                </div>
            </div>
        </>
    )

}


export default NavBarTwo;