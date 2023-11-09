import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faGear } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { RoomSettings } from './RoomSettings';
import axios from 'axios';



export const RoomInfos = ({ chatData }: any) => {
    
    const [showSettings, setShowSettings] = useState(false);
    const currentRoom: Contact = chatData?._chat


    const openSettings = () => {
      setShowSettings(true);
    };
      
    const closeSettings = () => {
      setShowSettings(false);
    };


    const leaveRoom = async () => {
        try {
            await axios.delete(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/${currentRoom.id}/${chatData._mainUser.id}`, {
                withCredentials: true,
            });
        } catch  {
            // console.log(error);
        }
        window.location.reload()
    }


    return (
        <div className="contactInfo">
                <div className="contactInfos">
                    
                    <div className="contactAvatar">
                        <img className='contact-avatar' src={ currentRoom.avatar } alt="room_avatar" />
                    </div>
                    <span>{ currentRoom.name }</span>
                </div>

                <div className="contactPlay2">
                    <div className="section2">
                        <FontAwesomeIcon className="info-icon" icon={faGear} onClick={openSettings} />
                        {/* <FontAwesomeIcon className="info-icon" icon={0 ? faBell : faBellSlash} /> */}
                        <a><FontAwesomeIcon className="info-icon" icon={faRightFromBracket} onClick={leaveRoom} /></a>
                    </div>
                </div>
                { showSettings && <RoomSettings onClose={closeSettings} chatData={ chatData } /> }
        </div>
    )
}
