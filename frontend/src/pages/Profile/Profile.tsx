import { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams } from 'react-router-dom';
import MyProfile from '../../components/Profile/Me/MyProfile';
import FriendProfile from '../../components/Profile/Friend/FriendProfile';
import NotFriendProfile from '../../components/Profile/NotFriend/NotFriendProfile';
import { useClient } from '@/context/clientContext';
import { useFetch } from '@/context/fetchContext';

function Profile() {
  const [data, setData] = useState(null);
  const { client, updateClient }  = useClient();
  // const navigate = useNavigate();
  const [profile, setProfile] = useState('');
  const {fetch, setFetch} = useFetch();
  const username = useParams().username !== undefined ? useParams().username : null;

  useEffect(() => {
    async function getUsers() {

      if ( username === client.username || !username) {
        setProfile('Me')
        console.log('#################')
        window.history.pushState(null, '', '/profile');
      }
      else if (username) {
        try {
          const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, { withCredentials: true });
          await updateClient({ ...client, ...res.data, signedIn: true });
        } catch {
          // console.log('Error : fetch data')
        }
        try {
          const res = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/search/${username}`, { withCredentials: true })).data
          const check = res.filter((user: { username: string }) => user.username === username)
        
          if (check.length) {
            setData(check);
            setProfile('Friend');
          } 
          else {
            const res = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/globalSearch/${username}`, { withCredentials: true })).data
            const check =  res.filter((user: { username: string }) => user.username === username);
              if (check.length) {
                setData(check);
                setProfile('NotFriend');
              }
              else 
                setProfile('NotFound')
          }
          setFetch(true)
        } catch (error) {
          // console.log('Error fetching data: ', error);
        }
      }

    }

    getUsers();
  }, [username, fetch]);


  return (
    <>
      {profile === 'Me' && <MyProfile />}
      {fetch && profile === 'Friend' && data && <FriendProfile userData={data} />}
      {fetch && profile === 'NotFriend' && data && <NotFriendProfile userData={data} />}
      {profile === 'NotFound' && <span className='no-users'> No User Found .... </span>}
    </>
  );
}

export default Profile;
