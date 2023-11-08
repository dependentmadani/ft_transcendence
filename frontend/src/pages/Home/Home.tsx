import './Home.css'
import {  useNavigate } from "react-router-dom"
import { useClient } from '@/context/clientContext';
import {  toast } from 'react-toastify';


export default function Home() {


    const { client}  = useClient();
    const  navigate = useNavigate();


    

    const handelStart = () => {

        if (!client.signedIn)
            navigate('/login');
        else
            navigate('/game');
    }
    toast.dismiss();

    return (
            <main className='main-home' >
                <div className="dscp-home">
                    <div id='home-title' >
                        <span className="title1"> MSKOTA </span>
                        <span className="title2"> LET'S PLAY<br /> <span className="tab">PONG</span></span>
                    </div>
                    <p className="comment">
                        <span className="tab1" /> Get ready to experience the thrill and excitement of one of the most beloved sports in the world.
                        Ping Pong! Our game takes this classic table tennis game to a whole new level, right in the comfort of your home.
                        <br /><br /> <span className="tab1" /> To Stay play with your friends .
                    </p>
                    <button className="getStart-b" onClick={handelStart}> Get Started </button>
                </div>
                <div className='home-img' >
                    <img  src='/src/imgs/home.png' alt='home.png' />
                </div>
            </main>
    )
}