import '../css/Login.css'
import SignUp from '../components/SignUp'
import { Link, Route, Routes, useNavigate} from "react-router-dom"
import { useEffect, useState } from 'react';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { useClient } from '../client/clientContext';
import Client from '../client/client';
import { iconName } from '@fortawesome/free-brands-svg-icons/faAccessibleIcon';
import {io, Socket } from 'socket.io-client'

function  Login(props:any) {
  
  const navigate = useNavigate();
  const [login, setLogin] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const {client, updateClient} = useClient();
  

    useEffect(() => {
      const fetchData = async () => {
        try {
          await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logged_in`, { withCredentials: true })
          setLogin(true)
          try {
            const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/me`,
            { withCredentials: true, }
            );
            const newSocket = io(`http://${import.meta.env.VITE_BACK_ADDRESS}`);
            setSocket(newSocket);
            console.log(newSocket)
            console.log('socket : ')
            console.log(socket)
            updateClient({...response.data, socket: socket})
          } catch (error) {
            console.log('Error to fetch user data : ', error);
          }
          // navigate('/')
        } catch (error) {
            setLogin(false)
          console.log('Did not login yet! :)');
        }
      };

      fetchData();

      return () => {
        if (socket)
          socket.disconnect();
      }

    }, []);
  
    const request42 = () => {
        window.location.replace(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/42`);
    };
    
    const requestGoogle = () => {
        window.location.replace(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/google_auth`);
    };
    
    return (
      <>
        { !login && <div className="row">
          <div className="logo-login">
              <Link to="/">
                  <img className="logo-login-img" src="src/imgs/logo.png" alt="Mskota-Logo" />
              </Link>
              </div>
              <div id="col-1">
              <h1 id="project-name">Mskota 👋</h1>
              <h1>Welcome to our PingPong login Page 🏓</h1>
              <div id="log">
                  <button onClick={request42} className="log-b-42">
                  <img src="src/imgs/42-white.png" alt="42 Logo" />
                  Log In With 42 intra
                  </button>
                  <button onClick={requestGoogle} className="log-b-google">
                  <img src="src/imgs/google1.png" alt="Google Logo" />
                  Log In With Google
                  </button>
              </div>
              </div>
              <div id="col-2">
              <img src="src/imgs/pingpong.gif" alt="pingpong-gif" />
              </div> 
          </div>
        }
      </>
    )
  }
  
  export default Login;