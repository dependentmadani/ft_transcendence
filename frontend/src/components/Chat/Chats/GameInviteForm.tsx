import  { useEffect, useRef  } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSocket } from '@/context/socketContext';
import { toast } from 'react-toastify';
import { useGame } from '@/context/GameContext';
import { useNavigate } from 'react-router-dom';


interface User {
    id: number,
    avatar: string,
    username: string,
}


export const GameInviteForm = ({ onClose, chatData }: any) => {

    const GameInviteRef = useRef<HTMLDivElement>(null);
    // const [loading, setLoading] = useState(false);
    // const [remainingTime, setRemainingTime] = useState(15)
    const { socketa } = useSocket();
    const { setGame } = useGame();
    const navigate = useNavigate();
 
    const mainUser: User =  chatData._mainUser
    const _receiver: User = chatData?._receiver

    // const startLoading = () => {
    //     setLoading(true);
    //     const interval = setInterval(() => {
    //         setRemainingTime(prevTime => prevTime - 1);
    //     }, 1000);

    //     setTimeout(() => {
    //         setLoading(false);
    //         clearInterval(interval);
    //         setRemainingTime(15);
    //     }, 15000);
    // };
  
    // handling the opening and the closing of the form
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (GameInviteRef.current && !GameInviteRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);


    const notificationListener = async (notif: any) => {
        toast.success(`${notif.receiver.username} Accepted you invitation to play`, {
            position: toast.POSITION.TOP_RIGHT
        });

        setGame({playerID1: notif.sender.id, playerID2: notif.receiver.id, mode: notif.mode})
        navigate('/game/invite')
    }
    
    useEffect(() => {

      socketa?.on('notificationAccepted', notificationListener);

        return () => {
          socketa?.off('notificationAccepted');
        };
    }, [socketa, notificationListener]);


    const sendGameInvite = async (mode: string) => {
        try {
                const res = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/notifications`, {
                    'type': 'GAME',
                    'read': false,
                    'receiverId': _receiver?.id,
                    'senderId': mainUser.id,
                    'mode': mode,
                }, {
                    withCredentials: true
                })
                console.log('WE TRYNNA PLAY MR ', res.data)

            socketa?.emit('notification', { notif: res.data });
        }
        catch  {
            // console.log(`coudn't create notification: `, err)
        }
    }



    return (
        <div className="overlay">
            <div className="form-container" ref={GameInviteRef}>
                <h2 className='change-room-name'>Choose a mode and notify { _receiver?.username } </h2>
                <div className="roomFomrs">
                    <div className="modes">
                        <a><FontAwesomeIcon className="info-icon" icon={faTableTennisPaddleBall} onClick={ () => sendGameInvite('classic') } />Classic Mode</a>
                        <a><FontAwesomeIcon className="info-icon" icon={faTableTennisPaddleBall} onClick={ () => sendGameInvite('tennis') } />Tennis Mode</a>
                    </div>
                    {/* <button className='send-game' onClick={startLoading} disabled={loading}>play</button>
                    {loading && <div className="loading-animation">Waiting for { _receiver?.username } to accept... {remainingTime}s</div>} */}
                </div>
            </div>
        </div>
    );
};