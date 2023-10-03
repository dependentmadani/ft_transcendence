import '../css/Home.css'
import { Link, Route, Routes} from "react-router-dom"
import Client from '../client/client';
import { useClient } from '../client/clientContext';

export default function Home(props:any) {

    const my_img:string = 'src/imgs/home.png'
    const { client }  = useClient();
    console.log(client)
    const divStyle = {
        color: 'green',
        // backgroundColor: 'yellow',
        fontSize: '24px',
      };
    return (
            <main className={`main-home ${props.isMenuOpen ? 'marg' : ''}`} >
                <div className="dscp-home">
                    <h1 style={divStyle}>UserName : {client._username}</h1>
                    {/* <span className="title1"> MSKOTA </span>
                    <span className="title2"> LET'S PLAY<br /> <span className="tab">PINGPONG</span></span>
                    <div className='home-2'>
                        <p className="comment">
                            <span className="tab1" /> Get ready to experience the thrill and excitement of one of the most beloved sports in the world.
                            Ping Pong! Our game takes this classic table tennis game to a whole new level, right in the comfort of your home.
                            <br /><br /> <span className="tab1" /> To Stay play with your friends .
                        </p>
                        <img  src={my_img} alt='home.png' />
                    </div>
                    <button className="getStart-b"><Link to='/login' > Get Started </Link></button>
                </div>
                <div className='home-img' >
                    <img  src={my_img} alt='home.png' /> */}
                </div>
            </main>
    )
}