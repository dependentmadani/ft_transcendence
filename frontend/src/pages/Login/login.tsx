import './login.css'
import {Link} from 'react-router-dom' 

function Login () {

  const request42 = () => {
    try {
      window.location.replace(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/42`);
    }catch {}
  };

  const requestGoogle = () => {
    try {
      window.location.replace(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/google_auth`);
    }catch {}
  };

  return (
    <div className='col1'>
      <h1 id="project-name">Mskota 👋</h1>
      <h1 id="comment" >Welcome to our 
        <Link to="/">
          <span id='pong' > Pong </span> 
        </Link>
        login Page 🏓
      </h1>
      <div id="log">
        <button onClick={request42} className="log-b-42">
          <img src="/src/assets/imgs/42-white.png" alt="42 Logo" />
          Log In With 42 intra
        </button>
        <button onClick={requestGoogle} className="log-b-google">
          <img src="/src/assets/imgs/google1.png" alt="Google Logo" />
          Log In With Google
        </button>
      </div>
    </div>
  )
}


export default Login;