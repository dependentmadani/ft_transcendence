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
  // const { auth, updateAuth } = useAuth();
  // const [auth, updateAuth] = useAuth();
  // const [h, setH] =useState(0);
  
    // useEffect(() => {
    //     const fetchdata = async() => {
    //       try {
    //         await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logged_in`, 
    //           { withCredentials: true })
    //         // await updateClient({...client, signedIn: true})
    //         try {
    //           const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/signed_up`, 
    //             { withCredentials: true })
    //             console.log(res.data)
    //             if (res.data)
    //               await updateClient({...client, signedUp: true})
    //             console.log(res)
    //             console.log('-----------hlwa--------------')
    //         } catch (err) {    
    //           await updateClient({...client, signedUp: false})
    //           console.log('Did not login yet! :)');
    //         }
    //       } catch (err) {    
    //         await updateClient({...client, signedIn: false})
    //         console.log('Did not login yet! :)');
    //       }
    //       console.log('last update : ')
    //       console.log(client)
    //     }
        

    //     fetchdata();
    // }, [])
    
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