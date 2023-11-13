// import '/Login.css'
import SignUp from '@/pages/SignUp/signup';
import Login from '@/pages/Login/login';
import { useNavigate} from "react-router-dom"
import { useEffect } from 'react';
import axios from "axios";
import { useClient } from '@/context/clientContext';
import { toast } from 'react-toastify';
import Login2FA from '@/pages/Login/login_2fa'




function  Sign(props:any) {
  
  // const navigate = useNavigate();
  // const [login, setLogin] = useState<boolean>(false);
  const {client, updateClient} = useClient();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      // console.log('fetch ')
      try {
        const res =await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logged_in`, { withCredentials: true });
        if (res.data) {
          const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/me`, { withCredentials: true });
          if (response.data) {
            await updateClient({ ...client, ...response.data, signedIn: true });
  
            if (response.data.signedUp && !response.data.twoEnabled) 
              navigate('/');
            else if (props.tag !== '2fa' && response.data.twoEnabled)
              navigate('/login_2fa')
          }
        }
        

      }
      catch (err) {
        console.log('Error fetching data: ', err);
      }
    }

      fetchData();
  }, []);
    
  const handelClick = () => {
    if ((client.signedUp && !client.twoEnabled) || !client.signedIn) 
      navigate('/');
    else if (client.twoEnabled) {
      toast.info("Submit Code !", {
        position: toast.POSITION.TOP_LEFT
      });
    }
    else if (!client.username) {
      toast.warn("Username Used !", {
        position: toast.POSITION.TOP_LEFT
      });
    }
    else {
      toast.info("Submit Data First !", {
        position: toast.POSITION.TOP_LEFT
      });
    }

  }

  // console.log('======= : ', props.tag)

    return (
      <>
        <div className="row">
          <div className="logo-login">
            <img className="logo-login-img" src="/src/assets/imgs/mskota.png" alt="Mskota-Logo" onClick={handelClick} />
          </div>
          <div className='body-login'>
              {props.tag === 'login' && <Login />}
              {props.tag === 'signup' && <SignUp />}
              {props.tag === '2fa' && <Login2FA />}
            <div className='col2'>
              <img src="/src/assets/imgs/pingpong.gif" alt="pingpong-gif" />
            </div>
          </div>
        </div>
      </>
    )
  }
  
  export default Sign;