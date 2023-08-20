// import React from 'react';
import logo from '../../assets/42logo.png';
import googlelogo from '../../assets/googlelogo.png';
import './login.css';
import '../../App.css';
import axios from "axios";

export default function Login() {

    axios.get(`http://${import.meta.env.VITE_ADDRESS}:8000/auth/logged_in`, {withCredentials: true})
        .then(()=> window.location.replace(`http://${import.meta.env.VITE_ADDRESS}:5173`))
        .catch(() =>  console.log('did not login yet! :)'))
        
    const request42 = async () => {
        window.location.replace(`http://${import.meta.env.VITE_ADDRESS}:8000/auth/42`);
      };


    const requestGoogle = async () => {
        window.location.replace(`http://${import.meta.env.VITE_ADDRESS}:8000/auth/google_auth`);
      };

    return (
        <div className='row'>
            <div id='col-1'>
                <div className='leftside'>
                    <h1>Welcome to our PingPong login Page 🏓</h1>
                    <div id="log">
                        <button onClick={request42} className="text42">
                            <img src={logo} />
                            Log In With 42 intra
                        </button>
                        <button onClick={requestGoogle} className="textgoogle">
                            <img src={googlelogo} />
                            Log In With Google
                        </button>
                    </div>
                </div>
            </div>
            <div id='col-2'>
                <div className='rightside'>

                </div>
            </div>
        </div>
    )
}