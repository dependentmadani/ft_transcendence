
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';
import { useProfile } from '@/context/ProfileContext';
import MyProfile from '../../components/Profile/Me/MyProfile';
import FriendProfile from '../../components/Profile/Friend/FriendProfile';
import NotFriendProfile from '../../components/Profile/NotFriend/NotFriendProfile';



function Profile() {

	console.log('@@@@@@@@@@@@@@@@@@@@@@@@')

	const [profile, setProfile] = useState('Me');
	const [data, setData] = useState(null);
	const username = useParams().username;
	
	// useEffect(() => {

	// 	async function fetchData () {
	// 		try {
	// 			const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, { withCredentials: true });
	// 			console.log('fetchDAta : ', res.data)
	// 			// setData(res.data)
	// 		} catch (error) {
	// 			console.error('Error fetching data: ', error);
	// 		}
	// 	}
	// }, [])


	console.log('holllllllllllllllla : ', username)

	useEffect(() => {
		async function getUsers() {

			try {
				const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/search/${username}`, { withCredentials: true });
				console.log(res.data)
				if (res.data.length) {
					setData(res.data)
					setProfile('Friend')
				}
				else {
					try {
						const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/globalSearch/${username}`, { withCredentials: true });
						console.log(res.data)
						if (res.data.length) {
							setData(res.data)
							setProfile('NotFriend')
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
		// fetchData();
	},[]);
	
	
		console.log('user : ', data)
		console.log('profile : ', profile)
		return (
			<>
				{ profile === 'Me' && < MyProfile />}
				{/* {data && <FriendProfile userData={data} />}
				
				{(data && profile === 'Friend') && <FriendProfile userData={data} />}
				{(data && profile === 'NotFriend') && <NotFriendProfile userData={data} />} */}
			</>
		)
}

export default Profile;
