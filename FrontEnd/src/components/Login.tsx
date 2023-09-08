import '../css/Login.css'
// import axios from "axios";

function Login() {

    // axios.get(`http://${import.meta.env.VITE_ADDRESS}:8000/auth/logged_in`, {withCredentials: true})
    //     .then(()=> window.location.replace(`http://${import.meta.env.VITE_ADDRESS}:5173`))
    //     .catch(() =>  console.log('did not login yet! :)'))
        
    const request42 = async () => {
        window.location.replace(`http://${import.meta.env.VITE_ADDRESS}:8000/auth/42`);
      };


    const requestGoogle = async () => {
        window.location.replace(`http://${import.meta.env.VITE_ADDRESS}:8000/auth/google_auth`);
      };

    return (
        <div className='row'>
            <div id='col-1'>
                <h1 id='project-name' >Mskota 👋</h1>
                <h1>Welcome to our PingPong login Page 🏓</h1>
                <div id="log">
                    <button onClick={request42} className="log-b-42">
                        <img src='src/imgs/42-white.png' />
                        Log In With 42 intra
                    </button>
                    <button onClick={requestGoogle} className="log-b-google">
                        <img src='src/imgs/google1.png' />
                        Log In With Google
                    </button>
                </div>
            </div>
            <div id='col-2'>
                <img src="src/imgs/pingpong.gif" alt="pingpong-gif" />
            </div>
        </div>
    )
}

export default Login;