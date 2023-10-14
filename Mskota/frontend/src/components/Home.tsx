import '../css/Home.css'
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom"
import Client from '../client/client';
import { useAuth } from '../client/authContext';
import { useClient } from '../client/clientContext';
import axios from 'axios';
import {io, Socket } from 'socket.io-client'


export default function Home(props:any) {

    // const my_img:string = 'src/imgs/home.png'
    const { client, updateClient }  = useClient();
    // const [socket, setSocket] = useState<Socket>(client.socket);
    // const { auth, updateAuth } = useAuth();
    // const navigate = useNavigate();


    // useEffect ( () => {
    //     async function fetchUserData() {
    //         try {
    //           const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/me`,
    //             { withCredentials: true, }
    //           );
    //           const data = response.data;
    //           updateClient(data);
    //           console.log('data : ')
    //           console.log(data)
    //           console.log('client data : ')
    //           console.log(client);
      
    //         } catch (error) {
    //           console.error('Error fetching data: ', error);
    //         }
    //       }
      
    //       fetchUserData();
    // }, [])

    // console.log('home')
    // console.log(client)
    
    // const handleLogout = async() => {
    //     try {
    //         await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logout`, 
    //             {withCredentials: true,}
    //         )
    //         // let tmp = client;
    //         // client.clean();
    //         // console.log("tmp : ")
    //         // console.log(tmp.clean)
    //         // socket.disconnect();
    //         // updateClient({...(client.clean)});
    //     } catch (error) {
    //         console.error('Error logout: ', error);
    //     }
    //     await updateClient({...(client.clean)});
    //     // navigate('/login')
    // }

    return (
            <main className='main-home' >
                <div className="dscp-home">
                    {/* <h1 style={divStyle}>UserName : {client.username}</h1>
                    <button onClick={handleLogin} >Login</button>
                    <button onClick={handleLogout} >Logout</button> */}
                    <div id='home-title' >
                        <span className="title1"> MSKOTA </span>
                        <span className="title2"> LET'S PLAY<br /> <span className="tab">PONG</span></span>
                    </div>
                    <p className="comment">
                        <span className="tab1" /> Get ready to experience the thrill and excitement of one of the most beloved sports in the world.
                        Ping Pong! Our game takes this classic table tennis game to a whole new level, right in the comfort of your home.
                        <br /><br /> <span className="tab1" /> To Stay play with your friends .
                    </p>
                    <button className="getStart-b">
                        { !client.signin ?
                            <Link to='/login' > Get Started </Link> :
                            <Link to='/game' > Get Started </Link> 
                        }
                    </button>
                </div>
                <div className='home-img' >
                    <img  src='src/imgs/home.png' alt='home.png' />
                </div>
            </main>
    )
}