import '../css/navBar.css'
import { Link, Route, Routes} from "react-router-dom"
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faAnglesLeft } from '@fortawesome/free-solid-svg-icons'


function NavBar(props:any) {
    
    const my_img:string = 'src/imgs/logo.png'
    // const list:JSX.Element

    const defaultList = ([
        <li key="home"> <Link to='/' className='link-b'> Home </Link> </li>,
        <li key="about"> <Link to='/about' className='link-b'> About </Link> </li>,
        <li key="developers"> <Link to='/developers' className='link-b'> Developers </Link> </li>,
    ])

    const [listItems, setListItems] = useState([...defaultList, (    
    <div className='login'>
        <Link to='/login' className='link-b'> Get Started </Link>
    </div>)]
    );

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {

        setIsMenuOpen(!isMenuOpen)
    };

    return (
        <>
            <nav className="bar">
                <div className='logo'>                    
                    <Link to='/' >
                        <img className="logo-img" src={my_img} alt='Mskota-Logo' /> 
                    </Link>
                </div>
                <ul className="list">
                    {defaultList}
                </ul>
                <div className='login'>
                    <Link to='/login' className='link-b'> Get Started </Link>
                </div>
                <div className='menu-ico' onClick={toggleMenu}>
                    <FontAwesomeIcon icon={!isMenuOpen ? faBars : faAnglesLeft} />
                </div>
            </nav>
            <div className={`drop-menu ${isMenuOpen ? 'open' : ''}`}>
                {listItems}
            </div>
        </>
    )
}

export default  NavBar;