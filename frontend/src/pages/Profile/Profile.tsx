import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MyProfile from '../../components/Profile/Me/MyProfile';
import FriendProfile from '../../components/Profile/Friend/FriendProfile';
import NotFriendProfile from '../../components/Profile/NotFriend/NotFriendProfile';

function Profile() {
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState<string | null>(null);
  const username = useParams().username;

  useEffect(() => {
    async function getUsers() {
      try {
        const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/search/${username}`, { withCredentials: true });
        console.log(res.data);
        if (res.data.length) {
          setData(res.data);
          setProfile('Friend');
        } else {
          try {
            const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/globalSearch/${username}`, { withCredentials: true });
            console.log(res.data);
            if (res.data.length) {
              setData(res.data);
              setProfile('NotFriend');
            }
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }

    getUsers();
  }, [username]);

  return (
    <>
      {profile === 'NotFriend' && <FriendProfile userData={data} />}
      {/* {data && profile === 'Friend' && <FriendProfile userData={data} />}
      {data && profile === 'NotFriend' && <NotFriendProfile userData={data} />} */}
      {!profile && <MyProfile />}
    </>
  );
}

export default Profile;
