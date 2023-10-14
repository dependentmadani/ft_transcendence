import '../css/navBarOne.css'
import { Link, Route, Routes, useNavigate } from "react-router-dom"
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faAnglesLeft } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../client/authContext'
import { useClient } from '../client/clientContext';
import axios from 'axios';
import { useEffect } from 'react'
// import { handleLogout } from './Logout';


function NavBarOne() {

    // const { auth, updateAuth } = useAuth();
    const { client, updateClient }  = useClient();
    const navigate = useNavigate();
    

    // useEffect (() => {

    //     const fetchData = async () => {
    //         // console.log(auth)
    //         try {
    //           await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logged_in`, 
    //             { withCredentials: true })
    //             console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhh')
    //             // updateAuth(true) 
    //         } catch (error) {
    //             // updateAuth(false)
    //             console.log('Did not login yet! :)');
    //         }
    //     }

    //     fetchData();
    // },[])


    // useEffect(() => {

    //     async function fetchUserData() {
    //       try {
    //         const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/me`,
    //           { withCredentials: true, }
    //         );
    //         const data = response.data;
    //         updateClient({...client, ...data});
    //         console.log('data : ')
    //         console.log(data)
    //         console.log('client data : ')
    //         console.log(client);
            
    //       } catch (error) {
    //         console.error('Error fetching data: ', error);
    //       }
    //     }
        
    //     if (client.signedIn)
    //         fetchUserData();
    //   }, []);

    
    const handleLogout = async() => {
        try {
            await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logout`, 
                {withCredentials: true,}
            )
        } catch (error) {
            console.error('Error logout: ', error);
        }
        // await updateClient({...client, signedIn: false})
        await updateClient({...(client.clean)});
        navigate('/')
    }


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
        !client.signedIn ? (
          <li key="logout" id="logout">
            <Link to='/login'> Get Started </Link>
          </li>
        ) : (
            <li key="logout" id="logout" >
                <Link to='/logout'> Log Out  </Link>
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
                        {!client.signedIn ? <Link to='/login' > Get Started </Link> 
                          : <li key="logout"  onClick={handleLogout}> Log Out </li>}
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

export default NavBarOne;