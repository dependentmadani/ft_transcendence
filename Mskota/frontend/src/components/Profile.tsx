import '../css/Profile.css'
import MyPieChart from './pieChart'
import Myhlwa from './Test'
import React, { useState, useEffect } from 'react';




function Badges() {
  return (
    <div className="badge-history">
      <div className="players">
        <img id="player" src="src/imgs/example.jpg" alt="user" />
        <img id="vs-img" src="src/imgs/vs-.png" alt="VS" />
        <img id="player" src="src/imgs/example.jpg" alt="user-vs" />
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
                <img src="src/imgs/bg-title.png" alt="title" />
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

    return (
        <div className='profile-info'>
            <div className='profile-info-left'>
                <img id='settings'  src="src/imgs/setting.png" alt="setting" />
                <div className='profile-img'>
                    <img src="src/imgs/example.jpg" alt="user-img" />
                </div>
                <div className='profile-name-rank'>
                    {/* <span className='profile-name'> Name </span> */}
                    <div className='profile-name'>
                        <img src="src/imgs/name-title.png" alt="name" />
                        <span id='rank' > Hamid </span> 
                    </div>
                    <div className='profile-rank'>
                        <img src="src/imgs/sircl.png" alt="rank" />
                        <span id='rank' > 5 </span> 
                    </div>
                </div>
            </div>
            <div className='profile-info-right'>
                <div id='title-achive' >
                    <img src="src/imgs/bg-title.png" alt="title" />
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
            my_search.style.width = '48%';
            search_icon.style.borderRadius = '0px 20px 20px 0';
            
        }
        else if (searchOpen) { 
            setIconSearch('/src/imgs/search.png');
            my_search.style.width = '36px' 
            search_icon.style.borderRadius = '20px'
        }
        setSearchOpen(!searchOpen);
    }

    return (
        <div className='user-friends'>
            <input type="search" className="search-input" placeholder="Search..." />
            <img id='search' src={iconSearch} alt="search" onClick={search_open} />
            <div id='title' >
                <img src="src/imgs/bg-title.png" alt="title" />
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
                <img src="src/imgs/bg-title.png" alt="title" />
                <span>Statistic </span>
            </div>
            <div id='chart'>
                <MyPieChart />
            </div>
        </div>
    )
}



function Profile () {


    return (
        <div className='profile'>
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

export default Profile;
