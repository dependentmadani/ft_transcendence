import './NotFriendProfile.css'
import { useClient } from '@/context/clientContext';
import MyPieChart from '@/components/Profile/PieChart/pieChart'
import React, { useState, useEffect } from 'react';
import axios from 'axios';




function Badges() {

    const handleclick = () => {
        console.log('profile_user')
    }

  return (
    <div className="badge-history">
      <div className="players">
        <img id="player" src="src/imgs/example.jpg" alt="user" />
        <img id="vs-img" src="src/imgs/vs-.png" alt="VS" />
        <img id="player" src="src/imgs/example.jpg" alt="user-vs" onClick={handleclick} />
        <div id="comma">
          <img src="src/imgs/comma.png" alt="comma" />
          <img src="src/imgs/comma.png" alt="comma" />
        </div>
      </div>
      <div className="score-match">
        <div className="score">
          <span>5</span>
          <span>3</span>
        </div>
      </div>
    </div>
  );
}

function Friend() {
    return (
        <div className='friend'>
            <img className='user-friend' src="src/imgs/example.jpg" alt="friend-img" />
            <span className='status-friend'><span id='circle'></span> status</span>
            <span className='name-friend'> Name</span>
            {/* <span className='icon-chat'></span> */}
            <img className='icon-chat' src="src/imgs/chat-room.png" alt="chat-img" />
        </div>
    )
}

function History () {
    return (
        <div className='history'>
            <div id='title' >
                {/* <img src="src/imgs/bg-title.png" alt="title" /> */}
                <span>History </span>
            </div>
            <div className='my-history'>
                
                <Badges />
                <Badges />
                <Badges />
                <Badges />
                <Badges />
                <Badges />
                <Badges />
                <Badges />
                <Badges />
                <Badges />
                <Badges />
                <Badges />
                <Badges />
            </div>        
        </div>
    )
}


function ProfileInfo () {

    const {client} = useClient();

    return (
        <div className='profile-info'>
            <div className='profile-info-left'>
                <div className='profile-img'>
                    <img src={client.avatar} alt="user-img" />
                </div>
                <div className='profile-name-rank'>
                    {/* <span className='profile-name'> Name </span> */}
                    <div className='profile-name'> {client.username} </div>
                    <div className='profile-rank'> 5 </div>
                </div>
            </div>
        </div>
    )
}

function Frindes () {


    const [searchOpen, setSearchOpen] = useState(false);
    const [iconSearch, setIconSearch] = useState('src/imgs/search.png');
    

    // var icon_search:string = ;
    
    const search_open = () => {
        const my_search = document.querySelector('.search-input') as HTMLElement
        const search_icon = document.getElementById('search') as HTMLElement
        // console.log ('hlwa')
        if (!searchOpen) {
            setIconSearch('src/imgs/cancel-red.png');
            my_search.style.width = '100%';
            search_icon.style.borderRadius = '0px 20px 20px 0';
            
        }
        else if (searchOpen) { 
            setIconSearch('src/imgs/search.png');
            my_search.style.width = '0px'
            my_search.style.border = 'none' 
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



function NotFriendProfile () {

  console.log('profile')


    return (
        <div className='profile'>
            <img id='settings'  src="src/imgs/setting.png" alt="setting" />
            <div className='profile-col-1'>
                <ProfileInfo />
                <Frindes />
            </div>
            <div className='profile-col-2'>
                <History />
                <Statistic />
            </div>
            {/* <div className='blur' ></div>
            <div className='popup'></div> */}
        </div>
    )
}

export default NotFriendProfile;
