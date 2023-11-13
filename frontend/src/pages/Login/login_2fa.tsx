import { useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate, } from 'react-router-dom';
import { useClient } from '@/context/clientContext';
import {  toast } from 'react-toastify';



const Login2FA: React.FC = () => {

	
	const [code, setcode] = useState<string>('');
	const {client} = useClient();
	const navigate = useNavigate();


	async function checkCode()  {
		try {
			const response = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/2fa/verify`,
			{ code: code },
			{ withCredentials: true }
			);
			if (!response.data) {
				toast.error("Invalid Code !", {
					position: toast.POSITION.TOP_LEFT
				});
			}
			else {
				toast.success("Valide Code", {
					position: toast.POSITION.TOP_CENTER
				});
				navigate('/')
			}
		
		  } catch (error) {
			// console.log('Error fetching data: ', error);
		  }
	}


	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
		  event.preventDefault();
		  checkCode();
		}
	  };

	return (
	<div className='main-signup'>
		<span id='signup-header'>
			<span>Please </span> Enter Your <br /> Information
		</span>
		<form className='signup-form'>
			<div className='updateAvatar'>
			<img src={client.avatar || '/src/assets/imgs/user-img.png'} className='img-avatar' alt='User Avatar'/>
			</div>
			<input
				type='text'
				name='2fa'
				id='2fa'
				value={code}
				onKeyDown={handleKeyDown}
				placeholder='2FA Code'
				onChange={(e) => {setcode(e.target.value)}}
				autoComplete='off'
				required
			/>
			<input id='submit-button' type='button' value='Next ➝' onClick={checkCode} />
		</form>
    </div>)
}

export default Login2FA;