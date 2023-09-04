import '../css/navBar.css'
import { Link, Route, Routes} from "react-router-dom"


function NavBar(props:any) {
    
    const my_img:string = 'src/imgs/logo.png'


    return (
        <>
            <nav className="bar">
                <Link to='/' >
                     <img className="logo" src={my_img} alt='Mskota-Logo' /> 
                </Link>
                <div className="list">
                    <ul>
                        <li> <Link to='/' className='link-b'> Home </Link> </li>
                        <li> <Link to='/about' className='link-b'> About </Link> </li>
                        <li> <Link to='/developers' className='link-b'> Developers </Link> </li>
                    </ul>
                </div>
                <div></div>
            </nav>
        </>
    )
}

export default  NavBar;