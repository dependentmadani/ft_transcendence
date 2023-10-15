import '../css/Login.css'
import SignUp from './SignUp'
import Login from './Login'
import { Link, Route, Routes, useNavigate} from "react-router-dom"
import { useEffect, useState } from 'react';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { useClient } from '../client/clientContext';
import Client from '../client/client';
import { iconName } from '@fortawesome/free-brands-svg-icons/faAccessibleIcon';
import {io, Socket } from 'socket.io-client'
import { useAuth } from '../client/authContext';





function  Sign(props:any) {
  
  // const navigate = useNavigate();
  // const [login, setLogin] = useState<boolean>(false);
  const {client, updateClient} = useClient();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logged_in`, { withCredentials: true });

        const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/me`, { withCredentials: true });

        // Update the client data and navigate only after data is fetched
        await updateClient({ ...client, ...response.data, signedIn: true });
        
        if (response.data.signedUp) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }

    // Call the fetchData function within the useEffect
    fetchData();
  }, [client, updateClient, navigate]);
    
    return (
      <>
        <div className="row">
          <div className="logo-login">
            <Link to="/">
                <img className="logo-login-img" src="src/imgs/mskota.png" alt="Mskota-Logo" />
            </Link>
          </div>
          <div className='body-login'>
              {(props.tag === 'login') ? <Login /> : <SignUp />}
            <div className='col2'>
              <img src="src/imgs/pingpong.gif" alt="pingpong-gif" />
            </div>
          </div>
        </div>
      </>
    )
  }
  
  export default Sign;