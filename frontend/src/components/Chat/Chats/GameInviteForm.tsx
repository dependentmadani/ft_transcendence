import  { useEffect, useRef, useState,  } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
// interface User {}


export const GameInviteForm = ({ onClose, chatData }: any) => {

    const GameInviteRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [remainingTime, setRemainingTime] = useState(15)


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
    
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         onClose();
    //     }, 15000);

    //     return () => {
    //         clearTimeout(timer);
    //     };
    // }, [onClose]);



    return (
        <div className="overlay">
            <div className="form-container" ref={GameInviteRef}>
                <h2 className='change-room-name'>Choose a mode and notify { chatData?._chat?.chat.receiver?.username } </h2>
                <div className="roomFomrs">
                    <div className="modes">
                        <a href='#' ><FontAwesomeIcon className="info-icon" icon={faTableTennisPaddleBall} />classic mode</a>
                        <a href='#' ><FontAwesomeIcon className="info-icon" icon={faTableTennisPaddleBall} />mode akhor</a>
                    </div>
                    <button className='send-game' onClick={startLoading} disabled={loading}>play</button>
                    {loading && <div className="loading-animation">Waiting for { chatData?._chat?.chat.receiver?.username } to accept... {remainingTime}s</div>}
                </div>
            </div>
        </div>
    );
};
