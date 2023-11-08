import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import MyProfile from '../../components/Profile/Me/MyProfile';
import FriendProfile from '../../components/Profile/Friend/FriendProfile';
import NotFriendProfile from '../../components/Profile/NotFriend/NotFriendProfile';
import { useClient } from '@/context/clientContext';

function Profile() {
  const [data, setData] = useState(null);
  const { client }  = useClient();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<string | null>(null);
  const username = useParams().username !== undefined ? useParams().username : null;

  console.log('username : ', username)
  useEffect(() => {
    async function getUsers() {
      if (username === client.username)
        navigate('/profile')
      if (username) {
        try {
          const res = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/search/${username}`, { withCredentials: true })).data
          const check = res.filter(user => user.username === username)
        
          if (check.length) {
            setData(check);
            setProfile('Friend');
          } else {
              const res = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/globalSearch/${username}`, { withCredentials: true })).data
              const check =  res.filter(user => user.username === username);

              if (check.length) {
                setData(check);
                setProfile('NotFriend');
              } else {
                setProfile('NotFound')
              }
          }
          
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      }
      else {
        setProfile('Me')
      }
    }

    getUsers();
  }, [username]);

  return (
    <>
      {profile === 'Me' && <MyProfile />}
      {profile === 'NotFound' && <span className='no-users'> User Not Found .... </span>}
      {profile === 'Friend' && <FriendProfile userData={data} />}
      {profile === 'NotFriend' && <NotFriendProfile userData={data} />}

    </>
  );
}

export default Profile;
