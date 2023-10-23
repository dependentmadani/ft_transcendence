import './FriendProfile.css'
import { useClient } from '@/context/clientContext';
import MyPieChart from '@/components/Profile/PieChart/pieChart'
import React, { useState, useEffect } from 'react';
import axios from 'axios';




function Friend() {
    return (
        <div className='friend'>
            <img className='user-friend' src="/src/imgs/example.jpg" alt="friend-img" />
            <span className='status-friend'><span id='circle'></span> status</span>
            <span className='name-friend'> Name</span>
            {/* <span className='icon-chat'></span> */}
            <img className='icon-chat' src="/src/imgs/chat-room.png" alt="chat-img" />
        </div>
    )
}

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


    return (
        <div className='profile-info'>
            <div className='profile-info-left1'>
                <div className='profile-img1'>
                {/* <div id='status'></div> */}
                    <div id='status'>
                        <span>{props.userData.userStatus}</span>
                        <div></div>
                    </div>
                    <img src={props.userData.avatar ? props.userData.avatar : '/src/imgs/user-img.png'} alt="user-img" />
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

function Frindes () {


    const [searchOpen, setSearchOpen] = useState(false);
    const [iconSearch, setIconSearch] = useState('/src/imgs/search.png');
    

    // var icon_search:string = ;
    
    const search_open = () => {
        const my_search = document.querySelector('.search-input') as HTMLElement
        const search_icon = document.getElementById('search') as HTMLElement
        // console.log ('hlwa')
        if (!searchOpen) {
            setIconSearch('/src/imgs/cancel-red.png');
            my_search.style.width = '100%';
            search_icon.style.borderRadius = '0px 20px 20px 0';
            search_icon.style.background = 'transparent';
        }
        else if (searchOpen) { 
            setIconSearch('/src/imgs/search.png');
            my_search.style.width = '0px'
            my_search.style.border = 'none'
            search_icon.style.background = '#4c7dc1';
            search_icon.style.borderRadius = '20px'
        }
        setSearchOpen(!searchOpen);
    }

    const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            ///search in list friends 
            // try {
            //     await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/`, {withCredentials: true })

            // } catch (err) {
            //     console.log("Error : ", err)
            // }
        }
    }

    return (
        <div className='user-friends'>
            <div className='search-bar'>
                <input type="search" className="search-input" placeholder="Search..." />
                <img id='search' src={iconSearch} alt="search" onClick={search_open} onKeyDown={handleKey} />
            </div>
            {/* <div className='search-bar'>
            </div> */}
            <div id='title' >
                {/* <img src="src/imgs/bg-title.png" alt="title" /> */}
                <span>Friends </span>
            </div>
            <div className='friends-list'>
                <Friend />
                <Friend />
                <Friend />
                <Friend />
                <Friend />
                <Friend />
                <Friend />
                <Friend />
                <Friend />
                <Friend />
                <Friend />
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


    return (
        <div className='profile'>
            <img id='settings'  src="/src/imgs/setting.png" alt="setting" />
            <div className='profile-col-1'>
                <ProfileInfo userData={props.userData[0]} />
                <Frindes />
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
