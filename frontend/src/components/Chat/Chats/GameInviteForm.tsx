import  { useEffect, useRef, useState,  } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSocket } from '@/context/socketContext';

interface User {
    id: number,
    avatar: string,
    username: string,
}


export const GameInviteForm = ({ onClose, chatData }: any) => {

    const GameInviteRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [remainingTime, setRemainingTime] = useState(15)
    const { socketa } = useSocket();

    const mainUser: User =  chatData._mainUser
    const _receiver: User = chatData?._receiver

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
        // console.log('')
        alert(notif.receiver.username + ' accepted you invitation to play a ' + notif.mode + ' pong game')
        
        // Redirect Invitation sender (notif.receiver.id) here

    }
    
    useEffect(() => { 

      socketa?.on('notificationAccepted', notificationListener);

        return () => {
          socketa?.off('notificationAccepted');
        };
    }, [socketa, notificationListener]);


    const sendGameInvite = async (mode: string) => {
        try {
            
            
            
            // They must not be friends
            // const isFriend = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/friend-friend/${_receiver.id}`, {withCredentials: true})).data;
            // console.log('isFriend', isFriend)
            // const isReqFound = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/notifications/isFound/${mainUser.id}/${user.id}`, {withCredentials: true})).data;
            // if (/*!isReqFound &&*/ !isFriend) {
                // console.log('YOW YOW', chatData?._receiver?.id, mainUser.id)
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
            // }

            socketa.emit('notification', { notif: res.data });
        }
        catch (err) {
            console.log(`coudn't create notification: `, err)
        }
    }



    return (
        <div className="overlay">
            <div className="form-container" ref={GameInviteRef}>
                <h2 className='change-room-name'>Choose a mode and notify { _receiver?.username } </h2>
                <div className="roomFomrs">
                    <div className="modes">
                        <a href='#' ><FontAwesomeIcon className="info-icon" icon={faTableTennisPaddleBall} onClick={ () => sendGameInvite('classic') } />classic mode</a>
                        <a href='#' ><FontAwesomeIcon className="info-icon" icon={faTableTennisPaddleBall} onClick={ () => sendGameInvite('machiClassic') } />mode akhor</a>
                    </div>
                    <button className='send-game' onClick={startLoading} disabled={loading}>play</button>
                    {loading && <div className="loading-animation">Waiting for { _receiver?.username } to accept... {remainingTime}s</div>}
                </div>
            </div>
        </div>
    );
};
