import './navBarOne.css'
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useClient } from '@/context/clientContext';
import Client from '@/components/ClientClass/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faAnglesLeft } from '@fortawesome/free-solid-svg-icons'

function NavBarOne() {
    
    const { client, updateClient }  = useClient();
    const [listItems, setListItems] = useState<JSX.Element>();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const [orientation, setOrientation] = useState<number>(window.orientation);
    const navigate = useNavigate();

    
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
        localStorage.removeItem(import.meta.env.VITE_CLIENT_STORAGE_KEY)
        navigate('/')
    }

    const defaultList: JSX.Element = (
        <>
            <li key="home"> <Link to='/' className='link-b'> Home </Link> </li>
            <li key="about"> <Link to='/about' className='link-b'> About </Link> </li>
            <li key="developers"> <Link to='/team' className='link-b'> Team </Link> </li>
        </>
    )


    const toggleMenu = () => {
        if (!open)
            return ;
        if (!isMenuOpen)
            open.style.height = '0px';
        else {
            open.style.display = 'flex'
            if (window.innerWidth <= 800) {
                if (client.signedIn) {
                    setListItems(
                        <>
                            <li key="profile"> <Link to='/profile' > Profile </Link> </li>
                            <li key="home"> <Link to='/' > Home </Link> </li>
                            <li key="chat"> <Link to='/about'> About </Link> </li>
                            <li key="play"> <Link to='/team' > Team </Link> </li>
                            <li key="logout" id="logout" onClick={handleLogout} >  LogOut </li>
                        </>)
                    open.style.height = '220px'
                }
                else {
                    setListItems(
                    <>
                        {defaultList}
                        <li key="getStarted" id="logout">
                            <Link to='/login'> Get Started </Link>
                        </li>
                    </>
                    )
                    open.style.height = '200px'
                }
            } else {
                if (client.signedIn) {
                    open.style.height = '120px'
                    setListItems(
                        <>
                            <li key="profile"> <Link to='/profile' > Profile </Link> </li>
                            <li key="logout" id="logout"  onClick={handleLogout} >  LogOut  </li>
                        </>
                    )
                }
                else 
                    open.style.display = 'none'
            }
        }
    };

    // const handleOrientationChange = () => { 
    //     toggleMenu();
    //     setOrientation(window.orientation);
    // };

    useEffect(() => {

        toggleMenu();
      }, [isMenuOpen, client.signedIn]);


    return (

            <>
                <nav className='bar'>
                    <Link to='/' >
                        <img className="logo-img" src='/src/imgs/mskota.png' alt='Mskota-Logo' /> 
                    </Link>
                    <ul className="list">
                        {defaultList}
                    </ul>
                    {!client.signedIn ?
                        <div className='login' onClick={()=> {navigate('/login')}} > Get Started </div> :
                        <button id='drop1' onClick={() => {setIsMenuOpen(!isMenuOpen)}}  onBlur={() => {setIsMenuOpen(false)}} > 
                            <img className='user-img' src={client.avatar} alt="user-img"  onError={(e) => { e.target.src = '/src/imgs/user-img.png'; }} />
                        </button>
                    }
                    {!client.signedIn && <div className='menu-ico' onClick={() => {setIsMenuOpen(!isMenuOpen)}}>
                        <FontAwesomeIcon icon={!isMenuOpen ? faBars : faAnglesLeft} />
                    </div>}
                    <div className={`drop-menu`}>
                        {listItems}
                    </div>
                </nav>
            </>
    )
}

export default NavBarOne;