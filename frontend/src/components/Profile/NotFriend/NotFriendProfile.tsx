import './NotFriendProfile.css'
import { useClient } from '@/context/clientContext';
import MyPieChart from '@/components/Profile/PieChart/pieChart'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
// import My from '@/imgs/add-friend.svg'
import { ReactSVG } from "react-svg";
import { useSocket } from '@/context/socketContext';

function ProfileInfo (props: any) {

    const [baseImg, setBaseImg] = useState(props.userData.avatar);
    const {socketa} = useSocket();

    useEffect(() => {

        const statu = document.getElementById('status')?.querySelector('div') as HTMLElement;
        if (props.userData.userStatus === 'ONLINE')
            statu.style.background = 'springgreen';
        else if (props.userData.userStatus === 'OFLINE')
            statu.style.background = 'red';
        else
            statu.style.background = '#15a3e9'

    }, [])

    const sendFriendRequest = async (user: User) => {
        const mainUser: User = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
        
        // They must not be friends
        // const isFriend = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/friend-friend/${user.id}`, {withCredentials: true})).data;
        // const isReqFound = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/notifications/isFound/${mainUser.id}/${user.id}`, {withCredentials: true})).data;
        // if (/*!isReqFound &&*/ !isFriend) {
            const res = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/notifications`, {
                // 'userId' : mainUser.id,
                // 'title': 'Friend request',
                'type': 'FRIEND',
                'read': false,
                // 'description': 'wants to connect with you',
                // 'icon': user?.avatar,
                'socketId': 'test123',
                'receiverId': user?.id,
                'senderId': mainUser?.id,
            }, {
            withCredentials: true
            })
            console.log('WE TRYNNA ADD MR ', user.username, res)
            socketa.emit('notification', { notif: res.data });
        // }
    }

    return (
        <div className='profile-info1'>
            <div className='profile-info1-left'>
                <div className='profile-img2'>
                    <div id='status'>
                      <span>{props.userData.userStatus}</span>
                      <div></div>
                    </div>
                    <img src={baseImg} onError={() => {setBaseImg('/src/imgs/user-img.png')}}  alt="user-img" />
                </div>
            </div>
            <div className='profile-info1-right'>
                <div className='profile-name-rank1'>
                    <div className='profile-name1'> {props.userData.username ? props.userData.username : 'hamid'} </div>
                    <div className='profile-rank1'> 5 </div>
                </div>
                <div className='profile-buttons'>
                    <ReactSVG src='/src/imgs/svg/add-user.svg' className="add-friend" onClick={() => sendFriendRequest(props.userData)} />
                    <ReactSVG src='/src/imgs/svg/play-game.svg' className="play-game" />
                </div>
            </div>
        </div>
    )
}




function NotFriendProfile (props: any) {

  console.log('profile : ', props.userData)


    return (
        <div className='profile'>
                <ProfileInfo userData={props.userData[0]} />
        </div>
    )
}

export default NotFriendProfile;
