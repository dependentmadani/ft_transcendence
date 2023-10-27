import './FriendProfile.css'
import { useClient } from '@/context/clientContext';
import MyPieChart from '@/components/Profile/PieChart/pieChart'
import Friends from '../search/searchFriend';
import React, { useState, useEffect } from 'react';
import axios from 'axios';






function Achivement () {
    return (
    <div className='achivement'>
        <div id='title' >
            {/* <img src="src/imgs/bg-title.png" alt="title" /> */}
            <span>Achivements</span>
        </div>
        <div className='achivements'>
            <div className="card-client">
                <div className="achieve-icon">
                    <img src="achievement-icons/aicrusher.png" alt="" />
                </div>
                <div className="achieve-data">
                    <p className="description">Conqueror!
                        <span>Win 3 games in a row</span>
                    </p>
                </div>
            </div>

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

    const [baseImg, setBaseImg] = useState(props.userData.avatar);

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
                    <img src={baseImg} onError={() => {setBaseImg('/src/imgs/user-img.png')}} alt="user-img" />
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


function Statistic() {

    return (
        <div className='statistic'>
            <div id='title' >
                {/* <img src="src/imgs/bg-title.png" alt="title" /> */}
                <span>Statistic </span>
            </div>
            <div id='chart'>
                <MyPieChart />
            </div>
        </div>
    )
}



function FriendProfile (props: any) {

    console.log('profileFriend', props.userData)
    const [listFriend, setListFriend] = useState();

    useEffect(() => {
        async function fetchData () {
            try {
                const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/search/${props.userData.username}`, { withCredentials: true });
                console.log('fetchDAta : ', res.data)
                setListFriend(res.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        fetchData();
    }, [])

    return (
        <div className='profile'>
            <img id='settings'  src="/src/imgs/setting.png" alt="setting" />
            <div className='profile-col-1'>
                <ProfileInfo userData={props.userData[0]} />
                <Friends friendData={listFriend} />
            </div>
            <div className='profile-col-2'>
                <Achivement />
                <Statistic />
            </div>
            {/* <div className='blur' ></div>
            <div className='popup'></div> */}
        </div>
    )
}

export default FriendProfile;
