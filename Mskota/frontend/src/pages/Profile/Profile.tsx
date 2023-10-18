
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useProfile } from '@/context/ProfileContext';
import MyProfile from '../../components/Profile/Me/MyProfile';
import FriendProfile from '../../components/Profile/Friend/FriendProfile';
import NotFriendProfile from '../../components/Profile/NotFriend/NotFriendProfile';



function Profile():JSX.Element {

	const {profileState} = useProfile(); 

	return (		
		<>
			((profileState === 'my_profile') && <MyProfile />)
			((profileState === 'friend_profile') && <FriendProfile />)
			((profileState === 'not_friend') && <NotFriendProfile />)
		</>
	)
}

export default Profile;
