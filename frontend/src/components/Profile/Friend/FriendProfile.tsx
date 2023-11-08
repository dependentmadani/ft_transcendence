import './FriendProfile.css'
import { useClient } from '@/context/clientContext';
import Friends from '../search/searchFriend';
import React, { useState, useEffect } from 'react';
import { useSetting } from '@/context/SettingContext';
import SettingsComponent from './settings'
import Statistic from '@/components/Profile/Me/static';
import axios from 'axios';






const Achieve = (props:any) => {
    return (
        <div className="achieve-card">
            <div className={props.change ? "achieve-icon akinator-img" : "achieve-icon"}>
                <img src={props.achieveImg} height={props.height} alt="" />
            </div>
            <div className="achieve-data">
                <p className="description">
                    {props.achieveTitle}
                    <span> {props.achieveDiscription}</span>
                </p>
            </div>
        </div>
    )
}


function Achivement (props: any) {
    const [badge, setBadge] = useState({});

    useEffect( () => {

        async function getAchievements() {
            try {
                const response = await axios.get(`http://localhost:8000/users/achievements/${props.friendId}`, {withCredentials: true});
                setBadge(response.data);
                // console.log("badge !!!!! ", response.data);
            } catch (error) {
                console.error("Error fetching achievements data:", error);
            }
        };
        getAchievements();
    }, []);

    return (
    <div className='achivement'>
        <div id='title' >
            {/* <img src="src/imgs/bg-title.png" alt="title" /> */}
            <span>Achivements</span>
        </div>
        <div className='achivements'>
            {!(badge.first_server || badge.conqueror || badge.ai_crusher  || badge.disciplined || badge.extrouvert || badge.failure || badge.challenger) && <span className='no-users no-achieve'> No Achievements .... </span>}
            { badge.first_server && <Achieve achieveImg='/src/imgs/achievement-icons/firstserv.png' achieveTitle='First Serve!' achieveDiscription='Win your first game' />}
            { badge.conqueror && <Achieve achieveImg='/src/imgs/achievement-icons/Conqueror.png' achieveTitle='Conqueror!' achieveDiscription='Win 3 games in a row' /> }
            { badge.ai_crusher && <Achieve achieveImg='/src/imgs/akinator1.png' change={true} achieveTitle='Akinator Victory!' achieveDiscription='Beat AI bot' /> }
            { badge.disciplined  && <Achieve achieveImg='/src/imgs/achievement-icons/Practice.png' achieveTitle='Disciplined!' achieveDiscription='Play 5 practice games' /> }
            { badge.extrouvert && <Achieve achieveImg='/src/imgs/achievement-icons/social.png' achieveTitle='Extrouvert!' achieveDiscription='Have min of 5 friend' /> }
            { badge.failure && <Achieve achieveImg='/src/imgs/achievement-icons/failure.png' achieveTitle='You Failed!' achieveDiscription='You lost 5 games' /> }
            { badge.challenger && <Achieve achieveImg='/src/imgs/achievement-icons/challenger.png' achieveTitle='Challenger!' achieveDiscription='Play against 3 opponents' /> }
        </div>
    </div>
    )
}


function ProfileInfo (props: any) {

    const [rank, setRank] = useState(0)

    useEffect(() => {

        const statu = document.getElementById('status')?.querySelector('div') as HTMLElement;
        if (props.userData.userStatus === 'ONLINE')
            statu.style.background = 'springgreen';
        else if (props.userData.userStatus === 'OFLINE')
            statu.style.background = 'red';
        else
            statu.style.background = '#15a3e9'

        async function getrank() {
            try {
                const res = await axios.get(`http://localhost:8000/game/leaderboard/${props.userData.username}`, { withCredentials: true }  ) 
                // console.log('$$$$$$ : ', res)
                setRank(res.data)
            }catch (err) {
                console.log('Error to get data')
            }
        }

        getrank();

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
                    <div className='profile-rank'> {rank} </div>
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
        setPopSettings(false)
        async function fetchData () {
            try {
                const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/friend-friends/${props.userData[0].id}`, { withCredentials: true });
                setListFriend(res.data);
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
                    <Achivement friendId={props.userData[0].id} />
                    <Statistic gameData={props.userData[0].games} />
                </div>
                <SettingsComponent userData={props.userData[0]}  />
            </div>
        </>
    )
}

export default FriendProfile;
