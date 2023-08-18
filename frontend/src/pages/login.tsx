import React from 'react';
import axios from 'axios'
import logo from '../assets/42logo.png';
import googlelogo from '../assets/googlelogo.png';
import './login.css';

export default function Login() {
    const request42 = async () => {
        try {
          const response = await axios.get('http://localhost:8000/auth/42');
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      };

    console.log('request 42:', request42)

    const requestGoogle = async () => {
        try {
          const response = await axios.get('http://localhost:8000/auth/google_auth');
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      };
    console.log('request google:', requestGoogle)


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