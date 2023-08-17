import React from 'react';
import logo from '../assets/42logo.png';
import googlelogo from '../assets/googlelogo.png';
import './login.css';

export default function Login() {

    return (
        <div className='row'>
            <div id='col-1'>
                <div className='leftside'>
                    <h1>Welcome to our PingPong login Page 🏓</h1>
                    <div id="log">
                        <button className="text42">
                            <img src={logo} />
                            Log In With 42 intra
                        </button>
                        <button className="textgoogle">
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