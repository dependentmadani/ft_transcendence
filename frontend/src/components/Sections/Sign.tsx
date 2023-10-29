// import '/Login.css'
import SignUp from '@/pages/SignUp/SignUp';
import Login from '@/pages/Login/Login';
import { Link, useNavigate} from "react-router-dom"
import { useEffect, useState } from 'react';
import axios from "axios";
import { useClient } from '@/context/clientContext';
import { useSocket } from '@/context/socketContext';
import io, { Socket } from 'socket.io-client';





function  Sign(props:any) {
  
  const {socketa, setSocketa} = useSocket();
  const {client, updateClient} = useClient();
  const navigate = useNavigate();
  console.log('***** sign ******')
  
  useEffect(() => {
    async function fetchData() {
      console.log('fetch ')
      try {
        await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logged_in`, { withCredentials: true });

        // setSocketa(io(`http://${import.meta.env.VITE_BACK_ADDRESS}/notification`))

        const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/me`, { withCredentials: true });

        console.log(response.data)
        await updateClient({ ...client, ...response.data, signedIn: true });
        
        if (response.data.signedUp) {
          console.log('vvvvvvvvvvvvvvvvvvvvvv')
          // setSocketa(io(`http://${import.meta.env.VITE_BACK_ADDRESS}/notification`))
          navigate('/')
          }
        // return () => {
        //   _socket?.disconnect()
        // }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }

    // Call the fetchData function within the useEffect
    // if (props.tag === 'login')
      fetchData();
  }, []);
    
    return (
      <>
        <div className="row">
          <div className="logo-login">
            <Link to="/">
                <img className="logo-login-img" src="/src/imgs/mskota.png" alt="Mskota-Logo" />
            </Link>
          </div>
          <div className='body-login'>
              {(props.tag === 'login') ? <Login /> : <SignUp />}
            <div className='col2'>
              <img src="/src/imgs/pingpong.gif" alt="pingpong-gif" />
            </div>
          </div>
        </div>
      </>
    )
  }
  
  export default Sign;