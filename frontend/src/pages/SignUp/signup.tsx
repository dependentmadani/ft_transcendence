import { useEffect, useState } from 'react';
import './SignUp.css';
import axios from 'axios';
import { useNavigate, } from 'react-router-dom';
import { useClient } from '@/context/clientContext';

function SetInfo() {
  const [fileUploaded, setFileUploaded] = useState<File | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('@/imgs/user-img.png');
  const {client, updateClient} = useClient();
  const navigate = useNavigate();
  // console.log('signup')

  
  
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/me`, 
          { withCredentials: true }
        );
        setUserId(response.data.id);
        setAvatar(response.data.avatar);
        setUsername(response.data.username);
        console.log('response.data : ', response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }
  
    fetchUserData();
  }, []);
  


  const handleChangeAvatar = (file: FileList | null) => {
    if (file && file.length > 0) {
      const fileRef = file[0];
      const reader = new FileReader();

      reader.readAsDataURL(fileRef);
      reader.onload = (ev: any) => {
        setAvatar(ev.target.result);
        setFileUploaded(fileRef);
      };
    }
  };

  const handleChangeUsername = (name: string) => {
    setUsername(name);
  };

  const handleSubmit = async () => {
    try {
      axios.patch(
        `http://${import.meta.env.VITE_BACK_ADDRESS}/users/${userId}`,
        {
          username: username,
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }  
        )
      if (fileUploaded) {
        axios.post(
          `http://${import.meta.env.VITE_BACK_ADDRESS}/users/${userId}/infos`,
          {
            avatar: fileUploaded,
          },
          {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
          }
          );
        }
      } catch (error) {
        console.error('Error submitting data:', error);
      }
      navigate('/login');
  };
  // console.log('login');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // console.log('hlwa')
      handleSubmit();
    }
  };

  return (
    <div className='main-signup'>
      <span id='signup-header'>
        <span>Please </span> Enter Your <br /> Information
      </span>
      <form className='signup-form'>
        <div className='updateAvatar'>
          <img src={avatar} className='img-avatar' alt='User Avatar' />
          <input
            id='file'
            type='file'
            accept='image/png, image/jpeg, image/jpg'
            onChange={(e) => handleChangeAvatar(e.target.files)}
          />
          <label htmlFor='file' className='choose-img'>
            <img src='@/imgs/change-img.png' alt='Upload' />
          </label>
        </div>
        <input
          type='text'
          name='username'
          id='name'
          value={username}
          onKeyDown={handleKeyDown}
          onChange={(e) => handleChangeUsername(e.target.value)}
          required
        />
        <input id='submit-button' type='button' value='Next ➝' onClick={handleSubmit} />
      </form>
    </div>
  );
}

export default SetInfo;
