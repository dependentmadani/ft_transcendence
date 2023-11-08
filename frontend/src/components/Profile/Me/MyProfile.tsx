import './MyProfile.css'
import { useClient } from '@/context/clientContext';
import Friends from '../search/searchFriend';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SettingsComponent from './settings'
import { useSetting } from '@/context/SettingContext';
import Statistic from '@/components/Profile/Me/static';


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
    if (!historyEntry) 
      return ;
  
    const handleclick = () => {
      console.log('profile_user');
    }
    // box-shadow: 0px 0px 8px 2px #39FF14;
  
    return (
      <div className="badge-history">
        <div className="players">
          <img id="player" style={historyEntry.myScore > historyEntry.oppScore ? { boxShadow: '0px 0px 4px 2px #39FF14' } : {boxShadow: '0px 0px 4px 2px #ff1e4f'}}
                src={historyEntry.myUser.avatar} alt={historyEntry.myUser.username} />
          <img id="vs-img" src="/src/imgs/vs-.png" alt="VS" />
          <img id="player" style={historyEntry.myScore < historyEntry.oppScore ? { boxShadow: '0px 0px 4px 2px #39FF14' } : {boxShadow: '0px 0px 4px 2px #ff1e4f'}}
                src={historyEntry.oppUser.avatar} alt={historyEntry.oppUser.username} onClick={handleclick} />
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
            } catch (error) {
                console.error("Error fetching history data:", error);
            }
        };
        getHistory();
    }, []);
    // console.log('---- : ', historyData)
    return (
        <div className='history'>
            <div id='title' >
                <span> History </span>
            </div>
            <div className='my-history'>
                {!historyData.length ? <span className='no-users'> No History .... </span> : historyData.map((entry, index) => (
                    <Badges key={index} historyEntry={entry} />
                ))}
            </div>        
        </div>
    )
}


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
            {!(badge.first_server || badge.conqueror || badge.ai_crusher  || badge.disciplined || badge.extrouvert || badge.failure || badge.challenger) && <span className='no-users no-achieve'> No Achievements .... </span>}
            { badge.first_server && <Achieve achieveImg='/src/imgs/achievement-icons/firstserv.png' achieveTitle='First Serve!' achieveDiscription='Win your first game' />}
            { badge.conqueror && <Achieve achieveImg='/src/imgs/achievement-icons/Conqueror.png' achieveTitle='Conqueror!' achieveDiscription='Win 3 games in a row' /> }
            { badge.ai_crusher && <Achieve achieveImg='/src/imgs/akinator1.png' change={true} achieveTitle='Akinator Victory!' achieveDiscription='Beat AI bot' /> }
            { badge.disciplined  && <Achieve achieveImg='/src/imgs/achievement-icons/Practice.png' achieveTitle='Disciplined!' achieveDiscription='Play 5 practice games' /> }
            { badge.extrouvert && <Achieve achieveImg='/src/imgs/achievement-icons/social.png' achieveTitle='Extrouvert!' achieveDiscription='Have min of 5 friend' /> }
            { badge.failure && <Achieve achieveImg='/src/imgs/achievement-icons/failure.png' achieveTitle='You Failed!' achieveDiscription='You lost 5 games' /> }
            { badge.challenger && <Achieve achieveImg='/src/imgs/achievement-icons/challenger.png' achieveTitle='Challenger!' achieveDiscription='Play against 3 opponents' /> }

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

function MyProfile () {

    console.log('MyProfile ')
    const {client, updateClient} = useClient();
    const [listFriend, setListFriend] = useState();
    const [popSettings, setPopSettings] = useSetting();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
    	async function fetchData () {
			try {
				const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, { withCredentials: true } );
                console.log('res --- : ', response.data)
                await updateClient({ ...client, ...response.data, signedIn: true });
                setLoading(false)
            } catch (error) {
				console.error('Error fetching data: ', error);
			}
		}
        fetchData();
    }, [])


    useEffect(() => {
        console.log('befor : ', popSettings)
        const settings_card = document.querySelector('.settings-card') as HTMLElement
        
        if (settings_card) {
            if (!popSettings)
                settings_card.style.display = 'none';
            else
                settings_card.style.display = 'flex'
        }
        // console.log('after : ', popSettings)
    }, [popSettings]);


    // console.log('-----------------------------------------', client)
    return (
        <>
            {loading ? <img id='Loding' src='/src/imgs/svg/eat.svg' /> : 
                <>
                    <div className='profile'>
                        <img id='settings'  src="/src/imgs/svg/setting.svg" alt="setting" onClick={() => {setPopSettings(!popSettings)}} onBlur={() => {setPopSettings(false)}} />
                        <div className='profile-col-1'>
                            <ProfileInfo />
                            <Friends friendsData={client.friends} />
                        </div>
                        <div className='profile-col-2'>
                            <History />
                            <Statistic gameData={client.games} />
                        </div>
                        <SettingsComponent />
                    </div>
                    <div className='blur'  style={!popSettings ? { display: 'none' } : { display: 'block' }} ></div>
                </>
            }
        </>
    )
}

export default MyProfile;
