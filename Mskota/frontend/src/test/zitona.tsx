import './zitona.css'
import { Link, Route, Routes} from "react-router-dom"
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faAnglesLeft } from '@fortawesome/free-solid-svg-icons'


function Zitona() {

    const defaultList = ([
        <li key="home"> <Link to='/' className='link-b'> Home </Link> </li>,
        <li key="about"> <Link to='/about' className='link-b'> About </Link> </li>,
        <li key="developers"> <Link to='/developers' className='link-b'> Developers </Link> </li>,
    ])

    const [listItems, setListItems] = useState([...defaultList, (    
    <div className='login'>
        <Link to='/login' > Get Started </Link>
    </div>)]
    );

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {

        setIsMenuOpen(!isMenuOpen)
    };

    return (
        <div className='body'>
            {/* Bar */}
                <nav className='bar'>
                    <div className='logo'>                    
                        <Link to='/' >
                            <img className="logo-img" src='src/imgs/logo.png' alt='Mskota-Logo' /> 
                        </Link>
                    </div>
                    <ul className="list">
                        {defaultList}
                    </ul>
                    <div className='login'>
                        <Link to='/login' > Get Started </Link>
                    </div>
                    <div className='menu-ico' onClick={toggleMenu}>
                        <FontAwesomeIcon icon={!isMenuOpen ? faBars : faAnglesLeft} />
                    </div>
                </nav>
                <div className={`drop-menu ${isMenuOpen ? 'open' : ''}`}>
                    {listItems}
                </div>
            {/* Main */}
                <div className='main'></div>
        </div>
    )
}

export default Zitona;