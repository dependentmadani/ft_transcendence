import '../css/navBar.css'
import { Link, Route, Routes} from "react-router-dom"
import React, { useState } from 'react';


function NavBar(props:any) {
    
    const my_img:string = 'src/imgs/logo.png'
    // const list:JSX.Element
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    document.getElementsByClassName()
    const toggleMenu = () => {
        // Toggle the state to open/close the menu
        const menuList = document.getElementById('list') as HTMLUListElement
        if (!isMenuOpen){
            setIsMenuOpen(!isMenuOpen);
            menuList.style.maxHeight = '0px'
        }
        else {
            setIsMenuOpen(!isMenuOpen);
            menuList.style.maxHeight = '127.15px'
        }

    };

    return (
        <>
            <nav className="bar">
                <div className='logo'>                    
                    <Link to='/' >
                        <img className="logo-img" src={my_img} alt='Mskota-Logo' /> 
                    </Link>
                </div>
                <div className='sub-bar'>                                
                    <div className="list" id='list'>
                        <ul>
                            <li> <Link to='/' className='link-b'> Home </Link> </li>
                            <li> <Link to='/about' className='link-b'> About </Link> </li>
                            <li> <Link to='/developers' className='link-b'> Developers </Link> </li>
                        </ul>
                    </div>
                    <div className='user'>
                        <p>name</p> {/* user.name */}
                        <div className='user-img'>
                            <img src='src/imgs/saitama.png' alt="user-img" />
                        </div>
                        <img className='icon-list' src='src/imgs/drop-down.png' alt="icon-list"  onClick={toggleMenu} />
                    </div>
                </div>
            </nav>
        </>
    )
}

export default  NavBar;