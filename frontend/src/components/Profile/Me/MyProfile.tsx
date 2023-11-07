import './MyProfile.css'
import { useClient } from '@/context/clientContext';
import MyPieChart from '@/components/Profile/PieChart/pieChart'
import Friends from '../search/searchFriend';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SettingsComponent from './settings'
import { useSetting } from '@/context/SettingContext';



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


const Achieves = () => {
    return (<>
        <div className="achieve-card">
                        <div className="achieve-icon">
                            <img src="./src/imgs/achievement-icons/firstserv.png" alt="" />
                        </div>
                        <div className="achieve-data">
                            <p className="description">First Serve!
                                <span> Win your first game
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="achieve-card">
                        <div className="achieve-icon">
                            <img src="./src/imgs/achievement-icons/Conqueror.png" alt="" />
                        </div>
                        <div className="achieve-data">
                            <p className="description">Conqueror!
                                <span>Win 3 games in a row
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="achieve-card">
                        <div className="achieve-icon">
                            <img src="./src/imgs/achievement-icons/aicrusher.png" alt="" />
                        </div>
                        <div className="achieve-data">
                            <p className="description">AI Crusher!
                                <span>Beat AI bot
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="achieve-card">
                        <div className="achieve-icon">
                            <img src="./src/imgs/achievement-icons/Practice.png" alt="" />
                        </div>
                        <div className="achieve-data">
                            <p className="description">Disciplined!
                                <span>Play 5 practice games
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="achieve-card">
                        <div className="achieve-icon">
                            <img src="./src/imgs/achievement-icons/social.png" alt="" />
                        </div>
                        <div className="achieve-data">
                            <p className="description">Introuvert!
                                <span>Invite 2 friend to play
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="achieve-card">
                        <div className="achieve-icon">
                            <img src="./src/imgs/achievement-icons/challenger.png" alt="" />
                        </div>
                        <div className="achieve-data">
                            <p className="description">Challenger!
                                <span>Play against 3 opponents
                                </span>
                            </p>
                        </div>
                    </div>
    </>)
}

function ProfileInfo () {

    const {client} = useClient();

    return (
        <div className='profile-info'>
            <div className='profile-info-left'>
                <div className='profile-img'>
                    <img src={client.avatar} alt="user-img" onError={(e) => { e.target.src = '/src/imgs/user-img.png'; }}  />                    
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
                    <Achieves />
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

    console.log('MyProfile ')
    const {client, updateClient} = useClient();
    const [listFriend, setListFriend] = useState();
    const [popSettings, setPopSettings] = useSetting();

    useEffect(() => {
    	async function fetchData () {
			try {
				const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, { withCredentials: true } );
                await updateClient({ ...client, ...response.data, signedIn: true });
            } catch (error) {
				console.error('Error fetching data: ', error);
			}
		}
        fetchData();
    }, [])


    useEffect(() => {
        console.log('befor : ', popSettings)
        const settings_card = document.querySelector('.settings-card') as HTMLElement
        
        if (!popSettings)
            settings_card.style.display = 'none';
        else
            settings_card.style.display = 'flex'

        console.log('after : ', popSettings)
    }, [popSettings]);


    console.log('-----------------------------------------', client)
    return (
        <>
            <div className='profile'>
                <img id='settings'  src="/src/imgs/svg/setting.svg" alt="setting" onClick={() => {setPopSettings(!popSettings)}} onBlur={() => {setPopSettings(false)}} />
                <div className='profile-col-1'>
                    <ProfileInfo />
                    <Friends friendsData={client.friends} />
                </div>
                <div className='profile-col-2'>
                    <History />
                    <Statistic />
                </div>
                <SettingsComponent />
            </div>
            <div className='blur'  style={!popSettings ? { display: 'none' } : { display: 'block' }} ></div>
        </>
    )
}

export default MyProfile;