import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBellSlash, faRightFromBracket, faGear } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { RoomSettings } from './RoomSettings';
import axios from 'axios';


export const RoomInfos = ({ currentRoom }: any) => {
    
    const [showSettings, setShowSettings] = useState(false);
    const [roomAvatar, setRoomAvatar] = useState('');


    const openSettings = () => {
      setShowSettings(true);
    };
      
    const closeSettings = () => {
      setShowSettings(false);
    };


    useEffect(() => {
        const fetchRoomAvatar = async () => {
            try {
                await axios.get(`http://localhost:8000/room/roomAvatar/${currentRoom.id}`, {withCredentials: true})
                setRoomAvatar(`http://localhost:8000/room/roomAvatar/${currentRoom.id}`);
            }
            catch (err) {
                console.log('No latest messages');
            }
        };

        fetchRoomAvatar();
    }, [currentRoom.id]);

    const kickMember = async () => {
        try {
            const _MAIN_USER_ = await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})
            const response = await axios.delete(`http://localhost:8000/roomUsers/${currentRoom.id}/${_MAIN_USER_?.data?.id}`, {
                withCredentials: true,
            });
            console.log(_MAIN_USER_?.data?.username , 'Kicked', response)
                
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="contactInfo">
                <div className="contactInfos">
                    
                    <div className="contactAvatar">
                        <img src={ roomAvatar } alt="room_avatar" />
                    </div>
                    <span>{ currentRoom.roomName }</span>
                </div>

                <div className="contactPlay2">
                    <div className="section2">
                        <span><FontAwesomeIcon className="searchIcon" icon={faGear} onClick={openSettings} /></span>
                        <span><FontAwesomeIcon icon={0 ? faBell : faBellSlash} /></span>
                        <span><FontAwesomeIcon icon={faRightFromBracket} onClick={kickMember} /></span>
                    </div>
                </div>
                { showSettings && <RoomSettings onClose={closeSettings} currentRoom={currentRoom} /> }
        </div>
    )
}
