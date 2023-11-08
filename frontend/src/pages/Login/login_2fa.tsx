import Reacr ,{ useEffect, useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate, } from 'react-router-dom';
import { useClient } from '@/context/clientContext';
import { ToastContainer, toast } from 'react-toastify';



const Login2FA: React.FC = () => {

	
	const [code, setcode] = useState<string>('');
	const [fetchCode, setFetchCode] = useState<boolean>(false);
	const {client, updateClient} = useClient();
	const navigate = useNavigate();


	async function checkCode()  {
		try {
			const response = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/2fa/verify`,
			{ code: code },
			{ withCredentials: true }
			);
			// console.log('response.data : ', response.data);
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
			console.error('Error fetching data: ', error);
		  }
	}


	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
		//   console.log('hlwa')
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
				<img src={client.avatar} className='img-avatar' alt='User Avatar' onError={(e) => { e.target.src = '/src/imgs/user-img.png'; }} />
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