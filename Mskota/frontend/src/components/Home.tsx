import '../css/Home.css'
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom"
import Client from '../client/client';
import { useClient } from '../client/clientContext';
import axios from 'axios';
import {io, Socket } from 'socket.io-client'


export default function Home(props:any) {

    const my_img:string = 'src/imgs/home.png'
    const { client, updateClient }  = useClient();
    const [socket, setSocket] = useState<Socket>(client.socket);
    const navigate = useNavigate();


    console.log(client.username)
    console.log('my client : -> ')
    console.log(client)
    const divStyle = {
        color: 'green',
        // backgroundColor: 'yellow',
        fontSize: '24px',
      };

    const handleLogin = () => {
        navigate('/login')
    }
    
    const handleLogout = async() => {
        try {
            await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logout`, 
                {withCredentials: true,}
            )
            // let tmp = client;
            // client.clean();
            // console.log("tmp : ")
            // console.log(tmp.clean)
            // socket.disconnect();
            // updateClient({...(client.clean)});
        } catch (error) {
            console.error('Error logout: ', error);
        }
        updateClient({...(client.clean)});
        // navigate('/login')
    }

    return (
            <main className='main-home' >
                <div className="dscp-home">
                    {/* <h1 style={divStyle}>UserName : {client.username}</h1>
                    <button onClick={handleLogin} >Login</button>
                    <button onClick={handleLogout} >Logout</button> */}
                    <div id='home-title' >
                        <span className="title1"> MSKOTA </span>
                        <span className="title2"> LET'S PLAY<br /> <span className="tab">PINGPONG</span></span>
                    </div>
                    {/* <div className='home-2'> */}
                        <p className="comment">
                            <span className="tab1" /> Get ready to experience the thrill and excitement of one of the most beloved sports in the world.
                            Ping Pong! Our game takes this classic table tennis game to a whole new level, right in the comfort of your home.
                            <br /><br /> <span className="tab1" /> To Stay play with your friends .
                        </p>
                        {/* <img  src={my_img} alt='home.png' /> */}
                    {/* </div> */}
                    <button className="getStart-b"><Link to='/login' > Get Started </Link></button>
                </div>
                <div className='home-img' >
                    <img  src={my_img} alt='home.png' />
                </div>
            </main>
    )
}