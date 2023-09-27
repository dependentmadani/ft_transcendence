import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBellSlash, faRightFromBracket, faMagnifyingGlass, faGear } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
// import { SearchResult } from '../Search/SearchResult';
import { RoomSettings } from './RoomSettings';
import axios from 'axios';

// interface User {
//     id: number;
//     username: string;
//     avatar: string,
// }


export const RoomInfos = ({ currentRoom }: any) => {
    
    const [showSettings, setShowSettings] = useState(false);

    const openSettings = () => {
      setShowSettings(true);
    };
      
    const closeSettings = () => {
      setShowSettings(false);
    };

    const [roomAvatar, setRoomAvatar] = useState('');

    useEffect(() => {
        const fetchRoomAvatar = async () => {
        try {
            const res = (await axios.get(`http://localhost:8000/room/roomAvatar/${currentRoom.id}`, {withCredentials: true}))?.data;
            setRoomAvatar(`http://localhost:8000/room/roomAvatar/${currentRoom.id}`);
        }
        catch (err) {
            console.error('No latest messages');
        }
        };
        fetchRoomAvatar();
    }, [currentRoom.id]);

    console.log('current room', currentRoom)

    return (
        <div className="contactInfo container-flex">
                <div className="contactInfos flex-item">
                    
                    <div className="contactAvatar">
                        <img src={ roomAvatar } alt="room_avatar" />
                    </div>
                    <span>{ currentRoom.roomName }</span>
                </div>

                <div className="contactPlay flex-item">
                    <span><FontAwesomeIcon className="searchIcon" icon={faGear} onClick={openSettings} /></span>
                    <span><FontAwesomeIcon icon={0 ? faBell : faBellSlash} /></span>
                    <span><FontAwesomeIcon icon={faRightFromBracket} /></span>
                </div>
                { showSettings && <RoomSettings onClose={closeSettings} currentRoom={currentRoom} />}
        </div>
    )
}
