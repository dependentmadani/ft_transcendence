import './navBarTwo.css'
import { Link, useNavigate } from "react-router-dom"
import  { useEffect, useState } from 'react';
import { useClient } from '@/context/clientContext';
import Client from '@/components/ClientClass/client';
import axios from 'axios';


const ListNotification = () => {

    return (
        <>
            <div className='add-friend-notific' >
                <img src="/src/imgs/example.jpg" alt="hlwa" />
                <span id='notific-user' >hamid</span>
                <span id='notific-title'>Friend</span>
                <button id='accept'> </button>
                <button id='refuse'></button>
            </div>
            <div className='play-notific' /*onClick={handelPlay}</>*/ >
                <img src="/src/imgs/example.jpg" alt="hlwa" />
                <span id='notific-user' >hamid</span>
                <span id='notific-title'>Let's Play</span>
            </div>
            <div className='add-friend-notific' ></div>
            <div className='add-friend-notific' ></div>
            <div className='add-friend-notific' ></div>
            <div className='add-friend-notific' ></div>
            <div className='add-friend-notific' ></div>
        </>
    )
}


function NavBarTwo (props:any) {

    const { client, updateClient }  = useClient();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const [orientation, setOrientation] = useState<number>(window.orientation);
    const [isNotificOpen, setIsNotificOpen] = useState(false);
    const [listItems, setListItems] = useState<JSX.Element>();
    const navigate = useNavigate();

    const openDrop =  document.querySelector('.drop-menu2') as HTMLElement;
    const openNotification =  document.querySelector('.drop-notification') as HTMLElement;
    const newNotification =  document.getElementById('newNotificaion') as HTMLElement;
    
    // const listNotific:JSX.Element = (
    // <>
    //     <div className='notifics' >
    //         <img src="/src/imgs/example.jpg" alt="hlwa" />
    //         <span id='notific-user' >hamid</span>
    //         <span id='notific-title'>Friend</span>
    //         <button id='accept'> </button>
    //         <button id='refuse'></button>
    //     </div>
    //     <div className='notifics' ></div>
    //     <div className='notifics' ></div>
    //     <div className='notifics' ></div>
    //     <div className='notifics' ></div>
    //     <div className='notifics' ></div>
    //     <div className='notifics' ></div>
    // </>
    // )




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

    const handleMenuOpen = () => {

        if (!openDrop) 
            return ;
        if (!isMenuOpen)
            openDrop.style.height = '0px';
        else {
            if (!window.matchMedia('(orientation: landscape)').matches) {
                setListItems(
                    <>
                        <li key="home"> <Link to='/' > Home </Link> </li>
                        <li key="profile1"> <Link to='/profile' > Profile </Link> </li>
                        <li key="chat"> <Link to='/chat'> Chat </Link> </li>
                        <li key="play"> <Link to='/play' > Play </Link> </li>
                        <li key="leaderboard"> <Link to='/leaderboard' > Leaderboard </Link> </li>
                        <li key="logout" id="logout" onClick={handleLogout} >  LogOut </li>
                    </>)
                openDrop.style.height = '250px'
            } else {
                setListItems( <li key="logout" id="logout"  onClick={handleLogout} >  LogOut  </li> )
                openDrop.style.height = '50px'
            }
        }
    };


    const handleNotificOpen = () => {
        
        if (!openNotification)
            return ;
        if (!isNotificOpen)
            openNotification.style.height = '0px';
        else {
            newNotification.style.display = 'none'
            if (window.innerWidth >= 900)
                openNotification.style.height = '200px';
            else
                openNotification.style.height = '100px'
        }
    }

    useEffect(() => {
        handleMenuOpen();
    }, [isMenuOpen]);

    useEffect(() => {
        handleNotificOpen();
    }, [isNotificOpen]);

    return ( 
        <>
            <div className='NavBarTwo'>
                <Link to='/' >
                    <img className='logo-img1'  src="/src/imgs/mskota.png" alt="Mskota-logo" />
                </Link>
                <div className='right-bar'>
                    <button  id='notificDrop' onClick={() => {setIsNotificOpen(!isNotificOpen)}}  onBlur={() => {setIsNotificOpen(false)}} >
                        <img className='notification' src="/src/imgs/notification.png" alt="Notification" />
                        <div id='newNotificaion'></div>
                    </button>
                    <div className='drop-notification'>
                        <ListNotification />
                    </div>
                    <button id='drop2' onClick={() => {setIsMenuOpen(!isMenuOpen)}}  onBlur={() => {setIsMenuOpen(false)}} > 
                        <img className='user-img2' src={client.avatar} alt="user-img"/>
                    </button>
                </div>
                <ul className="drop-menu2" >
                    {listItems}
                </ul>
            </div>
        </>
    )

}


export default NavBarTwo;