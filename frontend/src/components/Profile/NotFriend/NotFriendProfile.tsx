import './NotFriendProfile.css'
import { useClient } from '@/context/clientContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ReactSVG } from "react-svg";
import { useSocket } from '@/context/socketContext';
import { useNavigate} from 'react-router-dom';
import { useFetch } from '@/context/fetchContext';
import { useSetting } from '@/context/SettingContext';
import SettingsComponent from './settings';


function ProfileInfo (props: any) {

    const [baseImg, setBaseImg] = useState(props.userData.avatar);
    const {socketa} = useSocket();
    const { client}  = useClient();
    const [rank, setRank] = useState(0)
    const {setFetch} = useFetch();
    // const [bloccked, setBlocked] = useState(false);
    const navigate = useNavigate(); 

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
                const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/game/leaderboard/${props.userData.username}`, { withCredentials: true }  ) 
                setRank(res.data)
            }catch  {
                // console.log('Error to get data')
            }
        }

        getrank();

    }, [])

    useEffect(() => { 


        const notificationListener = async (notif: any) => {
            toast.success(`${notif.receiver.username} Accepted you invitation to play`, {
                position: toast.POSITION.TOP_RIGHT
            });
            setFetch(false);
            navigate(`/profile/${props.userData.username}`)
        }

        socketa?.on('notificationAccepted', notificationListener);
  
          return () => {
            socketa?.off('notificationAccepted');
          };
      }, [socketa]);

      const checkUser = () => {
        if (!client.blocked?.length)
            return ;
        const checker = client.blocked.filter((user:{username: string}) => (user.username === props.userData.username));
        console.log('checker', checker)
        if (checker.length) {
            try {
                axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/unblock-friend/${props.userData.id}`,{}, {withCredentials: true})
            } catch {
                // console.log('failed unblocked ')
            }
        }
          
      }

    const sendFriendRequest = async (user: User) => {

        const mainUser: User = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
        
            const res = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/notifications`, {

                'type': 'FRIEND',
                'read': false,
                'socketId': 'test123',
                'receiverId': user?.id,
                'senderId': mainUser?.id,
            }, {
            withCredentials: true
            })
            // console.log('WE TRYNNA ADD MR ', user.username, res)
            socketa?.emit('notification', { notif: res.data });
    }

    return (
        <div className='profile-info1'>
            <div className='profile-info1-left'>
                <div className='profile-img2'>
                    <div id='status'>
                      <span>{props.userData.userStatus}</span>
                      <div></div>
                    </div>
                    <img src={baseImg} onError={() => {setBaseImg('/src/assets/imgs/user-img.png')}} onClick={() => {navigate(`/profile/${props.userData.username}`)}} alt="user-img" />
                </div>
            </div>
            <div className='profile-info1-right'>
                <div className='profile-name-rank1'>
                    <div className='profile-name1'> {props.userData.username ? props.userData.username : 'hamid'} </div>
                    <div className='profile-rank1'> {rank} </div>
                </div>
                <div className='profile-buttons'>
                    <ReactSVG src='/src/assets/imgs/svg/add-user.svg' className="add-friend" onClick={() => {checkUser(); sendFriendRequest(props.userData)}} />
                    <ReactSVG src='/src/assets/imgs/svg/play-game.svg' className="play-game" />
                </div>
            </div>
        </div>
    )
}




function NotFriendProfile (props: any) {

    const [popSettings, setPopSettings] = useSetting();

    useEffect(() => {


        const settings_card = document.querySelector('.settings-noFriend') as HTMLElement
        
        if (!popSettings)
            settings_card.style.display = 'none';
        else
            settings_card.style.display = 'flex'


    }, [popSettings]);

    return (
        <div className='profile'>
                <img id='settings'  src="/src/assets/imgs/setting.png" alt="setting" onClick={() => {setPopSettings(!popSettings)}} onBlur={() => {setPopSettings(false)}} />
                <ProfileInfo userData={props.userData[0]} />
                <SettingsComponent user={props.userData[0]}  />
        </div>
    )
}

export default NotFriendProfile;
