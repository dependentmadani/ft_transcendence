// import '/Login.css'
import SignUp from '@/pages/SignUp/SignUp';
import Login from '@/pages/Login/Login';
import { Link, useNavigate} from "react-router-dom"
import { useEffect } from 'react';
import axios from "axios";
import { useClient } from '@/context/clientContext';
import { ToastContainer, toast } from 'react-toastify';





function  Sign(props:any) {
  
  // const navigate = useNavigate();
  // const [login, setLogin] = useState<boolean>(false);
  const {client, updateClient} = useClient();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      console.log('fetch ')
      try {
        await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logged_in`, { withCredentials: true });

        const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/me`, { withCredentials: true });

        console.log(response.data)
        await updateClient({ ...client, ...response.data, signedIn: true });
        
        if (response.data.signedUp) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }

    // Call the fetchData function within the useEffect
    // if (props.tag === 'login')
      fetchData();
  }, []);
    
  const handelClick = () => {
    // console.log
    if (client.signedUp) 
      navigate('/');

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

    return (
      <>
        <div className="row">
          <div className="logo-login">
            <img className="logo-login-img" src="/src/imgs/mskota.png" alt="Mskota-Logo" onClick={handelClick} />
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