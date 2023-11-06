import './MyProfile.css'
import { useClient } from '@/context/clientContext';
import MyPieChart from '@/components/Profile/PieChart/pieChart'
import Friends from '../search/searchFriend';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SettingsComponent from './settings'
import { useSetting } from '@/context/SettingContext';

interface HistoryEntry {
    id: number;
    myUser: {
      id: number;
      username: string;
      avatar: string;
    };
    oppUser: {
      id: number;
      username: string;
      avatar: string;
    };
    myScore: number;
    oppScore: number;
};

function Badges({ historyEntry }: { historyEntry: HistoryEntry }) {
    if (!historyEntry) {
      return null;
    }
  
    const handleclick = () => {
      console.log('profile_user');
    }
  
    return (
      <div className="badge-history">
        <div className="players">
          <img id="player" src={historyEntry.myUser.avatar} alt={historyEntry.myUser.username} />
          <img id="vs-img" src="/src/imgs/vs-.png" alt="VS" />
          <img id="player" src={historyEntry.oppUser.avatar} alt={historyEntry.oppUser.username} onClick={handleclick} />
          <div id="comma">
            <img src="/src/imgs/comma.png" alt="comma" />
            <img src="/src/imgs/comma.png" alt="comma" />
          </div>
        </div>
        <div className="score-match">
          <div className="score">
            <span>{historyEntry.myScore}</span>
            <span>{historyEntry.oppScore}</span>
          </div>
        </div>
      </div>
    );
  }

function History () {

    const [historyData, setHistoryData] = useState([]);

    useEffect( () => {

        async function getHistory() {
            try {
                const response = await axios.get(`http://localhost:8000/history`, {withCredentials: true});
                setHistoryData(response.data);
                // console.log("HISTORY ***__*** ", response.data);
            } catch (error) {
                console.error("Error fetching history data:", error);
            }
        };
        getHistory();
    }, []);
    return (
        <div className='history'>
            <div id='title' >
                <span>History </span>
            </div>
            <div className='my-history'>
                {historyData && historyData.map((entry, index) => (
                    <Badges key={index} historyEntry={entry} />
                ))}
                {/* <Badges />
                <Badges />
                <Badges /> */}
            </div>        
        </div>
    )
}



const Achieves = () => {
    
    const [badge, setBadge] = useState({});

    useEffect( () => {

        async function getAchievements() {
            try {
                const response = await axios.get(`http://localhost:8000/users/achievements`, {withCredentials: true});
                setBadge(response.data);
                // console.log("badge !!!!! ", response.data);
            } catch (error) {
                console.error("Error fetching achievements data:", error);
            }
        };
        getAchievements();
    }, []);
    return (
        <>
            { badge.first_server && (
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
            )}
            { badge.conqueror && (

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
            )}
            { badge.ai_crusher && (
                <div className="achieve-card">
                    <div className="achieve-icon">
                        <img src="./src/imgs/achievement-icons/aicrusher.png" alt="" />
                    </div>
                    <div className="achieve-data">
                        <p className="description">Akinator Victory!
                            <span>Beat AI bot
                            </span>
                        </p>
                    </div>
                </div>
            )}
            { badge.disciplined && (
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
            )}
            { badge.extrouvert && (
                <div className="achieve-card">
                    <div className="achieve-icon">
                        <img src="./src/imgs/achievement-icons/social.png" alt="" />
                    </div>
                    <div className="achieve-data">
                        <p className="description">Extrouvert!
                            <span>Have min of 5 friend
                            </span>
                        </p>
                    </div>
                </div>
            )}
            { badge.failure && (
                <div className="achieve-card">
                    <div className="achieve-icon">
                        <img src="./src/imgs/achievement-icons/failure.png" alt="" />
                    </div>
                    <div className="achieve-data">
                        <p className="description">You Failed!
                            <span>You lost 5 games
                            </span>
                        </p>
                    </div>
                </div>
            )}
            { badge.challenger && (
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
            )}
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
