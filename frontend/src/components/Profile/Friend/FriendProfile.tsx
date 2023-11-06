import './FriendProfile.css'
import { useClient } from '@/context/clientContext';
import Friends from '../search/searchFriend';
import React, { useState, useEffect } from 'react';
import { useSetting } from '@/context/SettingContext';
import SettingsComponent from './settings'
import Statistic from '@/components/Profile/Me/static';
import axios from 'axios';






function Achivement () {
    return (
    <div className='achivement'>
        <div id='title' >
            {/* <img src="src/imgs/bg-title.png" alt="title" /> */}
            <span>Achivements</span>
        </div>
        <div className='achivements'>
            <div className='achive'></div>
            <div className='achive'></div>
            <div className='achive'></div>
            <div className='achive'></div>
            <div className='achive'></div>
            <div className='achive'></div>
            <div className='achive'></div>
            <div className='achive'></div>
            <div className='achive'></div>
        </div>
    </div>
    )
}


function ProfileInfo (props: any) {


    useEffect(() => {

        const statu = document.getElementById('status')?.querySelector('div') as HTMLElement;
        if (props.userData.userStatus === 'ONLINE')
            statu.style.background = 'springgreen';
        else if (props.userData.userStatus === 'OFLINE')
            statu.style.background = 'red';
        else
            statu.style.background = '#15a3e9'

    }, [])

    return (
        <div className='profile-info'>
            <div className='profile-info-left1'>
                <div className='profile-img1'>
                    <div id='status'>
                        <span>{props.userData.userStatus}</span>
                        <div></div>
                    </div>
                    <img src={props.userData.avatar} onError={(e) => { e.target.src = '/src/imgs/user-img.png'; }} alt="user-img" />
                </div>
                <div className='profile-name-rank'>
                    {/* <span className='profile-name'> Name </span> */}
                    <div className='profile-name'> {props.userData.username ? props.userData.username : 'hamid'} </div>
                    <div className='profile-rank'> 5 </div>
                </div>
            </div>
        </div>
    )
}


function FriendProfile (props: any) {

    console.log('profileFriend', props.userData)
    const [listFriend, setListFriend] = useState(null);
    const [popSettings, setPopSettings] = useSetting();
    // const {client, updateClient} = useClient();

    useEffect(() => {
        async function fetchData () {
            try {
                const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/friend-friends/${props.userData[0].id}`, { withCredentials: true });
                setListFriend(res.data);
                // console.log('fetchDAta : ', res.data)
                // updateClient({...client, ...res})
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        fetchData();
    }, [props.userData[0].id])
    console.log('00000 : ',props.userData)

    useEffect(() => {
        console.log('befor : ', popSettings)
        const settings_card = document.querySelector('.settings-friend') as HTMLElement
        
        if (!popSettings)
            settings_card.style.display = 'none';
        else
            settings_card.style.display = 'flex'

        console.log('after : ', popSettings)
    }, [popSettings]);


    return (
        <>
            <div className='profile'>
                <img id='settings'  src="/src/imgs/setting.png" alt="setting" onClick={() => {setPopSettings(!popSettings)}} onBlur={() => {setPopSettings(false)}} />
                <div className='profile-col-1'>
                    <ProfileInfo userData={props.userData[0]} />
                    {listFriend && <Friends friendsData={listFriend} /> }
                </div>
                <div className='profile-col-2'>
                    <Achivement />
                    <Statistic gameData={props.userData[0].games} />
                </div>
                <SettingsComponent user={props.userData[0]}  />
            </div>
            {/* <div className='blur'  style={!popSettings ? { display: 'none' } : { display: 'block' }} ></div> */}
        </>
    )
}

export default FriendProfile;
