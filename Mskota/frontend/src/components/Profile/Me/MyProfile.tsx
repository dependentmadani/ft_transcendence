import './MyProfile.css'
import { useClient } from '@/context/clientContext';
import MyPieChart from '@/components/Profile/PieChart/pieChart'
import Friends from '../search/searchFriend';
import React, { useState, useEffect } from 'react';
import axios from 'axios';




function Badges() {

    const handleclick = () => {
        console.log('profile_user')
    }

  return (
    <div className="badge-history">
      <div className="players">
        <img id="player" src="/src/imgs/example.jpg" alt="user" />
        <img id="vs-img" src="/src/imgs/vs-.png" alt="VS" />
        <img id="player" src="/src/imgs/example.jpg" alt="user-vs" onClick={handleclick} />
        <div id="comma">
          <img src="/src/imgs/comma.png" alt="comma" />
          <img src="/src/imgs/comma.png" alt="comma" />
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

function History () {
    return (
        <div className='history'>
            <div id='title' >
                <span>History </span>
            </div>
            <div className='my-history'>
                
                <Badges />
                <Badges />
                <Badges />
                {/* <Badges />
                <Badges />
                <Badges /> */}
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
                    {/* <img src='/public/uploadAvatar/169720598979410e1162c-e9dc-46e3-b017-0ff49f3b62bd.jpeg' alt="user-img" /> */}
                    
                </div>
                <div className='profile-name-rank'>
                    <div className='profile-name'> {client.username} </div>
                    <div className='profile-rank'> 5 </div>
                </div>
            </div>
            <div className='profile-info-right'>
                <div id='title' >
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


function Statistic() {

    return (
        <div className='statistic'>
            <div id='title' >
                <span>Statistic </span>
            </div>
            <div id='chart'>
                <MyPieChart />
            </div>
        </div>
    )
}



function MyProfile () {

    console.log('profile')
    const [listFriend, setListFriend] = useState();

    useEffect(() => {
    	async function fetchData () {
			try {
				const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, { withCredentials: true });
				console.log('fetchDAta : ', res.data)
				console.log('fetchDAta : ', res.data.friends)
				setListFriend(res.data.friends);
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
                <ProfileInfo />
                <Friends friendData={listFriend} />
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

export default MyProfile;
