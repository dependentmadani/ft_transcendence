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
  
  const navigate = useNavigate();
  // const [login, setLogin] = useState<boolean>(false);
  const {client, updateClient} = useClient();
  const { auth, updateAuth } = useAuth();
  // const [auth, updateAuth] = useAuth();
  // const [h, setH] =useState(0);
  

    useEffect(() => {
      const fetchData = async () => {
        console.log(auth)
        try {
          await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logged_in`, 
            { withCredentials: true })
            updateAuth(true)
          // setH(1)
            // setLogin(true)
          // console.log(test)
          // try {
          // const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/me`,
          //   { withCredentials: true, });
          // updateClient({...response.data})
          // updateAuth(true)
          // console.log('-----------------------------------------------')
          // console.log(client)
          // if (auth)
          //   navigate('/')
          // } catch (error) {
          //   console.log('Error to fetch user data : ', error);
          // }
        } catch (error) {
          // setLogin(false)
          updateAuth(false)
          // if (!)
          console.log('Did not login yet! :)');
        }
        // console.log(h)
      };

      fetchData();
    }, []);
    
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