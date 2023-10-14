import '../css/navBarTwo.css'
import { Link, Route, Routes} from "react-router-dom"
import React, { useEffect, useState } from 'react';
import { useClient } from '../client/clientContext';



function NavBarTwo (props:any) {

    const { client } = useClient();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const [isMenuOpen1, setIsMenuOpen1] = useState(false);
    const [orientation, setOrientation] = useState<number>(window.orientation);
    const [isNotificOpen, setIsNotificOpen] = useState(false);
    const [listItems, setListItems] = useState<JSX.Element>();


  console.log('twobar')


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
                    <li key="logout" id="logout" > <Link to='/home' > LogOut </Link> </li>
                </>)
        } else 
            setListItems(<li key="logout" id="logout" > <Link to='/home' > LogOut </Link> </li>)
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
                    <img className='user-img' src={client.avatar} alt="user-img" onClick={toggleMenu} />
                </div>
                <div className={`drop-menu2 ${isMenuOpen ? 'open-menu2' : ''}`}>
                    {listItems}
                </div>
                {/* <div className={`drop-menu3 ${isMenuOpen1 ? 'open-menu3' : ''}`}>
                    {listItems}
                </div> */}
            </div>
        </>
    )

}


export default NavBarTwo;