import  { useEffect, useRef, useState,  } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSocket } from '@/context/socketContext';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';



interface User {
    id: number,
    avatar: string,
    username: string,
}


export const GameInviteForm = ({ onClose, chatData }: any) => {

    const GameInviteRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [remainingTime, setRemainingTime] = useState(15)
    const {socketa} = useSocket();
    const navigate = useNavigate();
    const [_game, setGame] = useGame();
    // const [redirect, setRedirect] = useState(false);

    // const handleClick = () => {
    //   setRedirect(true); 
  
    // if (redirect) {
    //   return <redirect to="/game/invite" />;
    // }

    const startLoading = () => {
        setLoading(true);
        const interval = setInterval(() => {
            setRemainingTime(prevTime => prevTime - 1);
        }, 1000);

        setTimeout(() => {
            setLoading(false);
            clearInterval(interval);
            setRemainingTime(15);
        }, 15000);
    };
  
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
        alert(notif.receiver.username + ' accepted you invitation to play a ' + notif.mode + ' pong game')
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$', notif)

        setGame({playerID1: notif.sender.id, playerID2: notif.receiver.id, mode: notif.mode})
        
        // Redirect Invitation sender (notif.receiver.id) here
        //NAVIGATE INVITE GAME SENDER;
        
        navigate('/game/invite')
    }
    
    useEffect(() => { 

      socketa?.on('receiveNotification', notificationListener);

        return () => {
          socketa?.off('receiveNotification');
        };
    }, [socketa, notificationListener]);


    const sendGameInvite = async (mode: string) => {
        try {
            const mainUser: User = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
            const user: User = chatData?._chat?.chat?.receiver
            
            // They must not be friends
            // const isFriend = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/friend-friend/${user.id}`, {withCredentials: true})).data;
            // const isReqFound = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/notifications/isFound/${mainUser.id}/${user.id}`, {withCredentials: true})).data;
            // if (/*!isReqFound &&*/ !isFriend) {
                console.log('YOW YOW', chatData?._chat?.chat?.receiver?.id, mainUser?.id)
                await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/notifications`, {
                    'type': 'GAME',
                    'read': false,
                    'receiverId': user?.id,
                    'senderId': mainUser?.id,
                    'mode': mode,
                }, {
                withCredentials: true
                })
                // console.log('WE TRYNNA PLAY MR ', user.username, res.data)
            // }

            // chatData?._socket.emit('notification', { notif: res.data });
        }
        catch (err) {
            console.log(`coudn't create notification: `, err)
        }
    }



    return (
        <div className="overlay">
            <div className="form-container" ref={GameInviteRef}>
                <h2 className='change-room-name'>Choose a mode and notify { chatData?._chat?.chat.receiver?.username } </h2>
                <div className="roomFomrs">
                    <div className="modes">
                        <a href='#' ><FontAwesomeIcon className="info-icon" icon={faTableTennisPaddleBall} onClick={ () => sendGameInvite('classic') } />classic mode</a>
                        <a href='#' ><FontAwesomeIcon className="info-icon" icon={faTableTennisPaddleBall} onClick={ () => sendGameInvite('tennis') } />mode akhor</a>
                    </div>
                    <button className='send-game' onClick={startLoading} disabled={loading}>play</button>
                    {loading && <div className="loading-animation">Waiting for { chatData?._chat?.chat.receiver?.username } to accept... {remainingTime}s</div>}
                </div>
            </div>
        </div>
    );
};
