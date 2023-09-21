import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBellSlash, faRightFromBracket, faMagnifyingGlass, faGear } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
// import { SearchResult } from '../Search/SearchResult';
import { RoomSettings } from './RoomSettings';

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

      console.log('current room', currentRoom)

  return (
      <div className="contactInfo container-flex">
            <div className="contactInfos flex-item">
                
                <div className="contactAvatar">
                    <img src={ currentRoom.roomAvatar } alt="room_avatar" />
                </div>
                <span>{ currentRoom.roomName }</span>
            </div>

            {/* <div className="mutualContact flex-item">
                <p>members</p>
                <p>room admin: { currentRoom.roomMembers }</p>
                <p>room users: { currentRoom.roomMembers }</p>
                <p>kicked users: { currentRoom.kickedUsers }</p>
                <p>baned users: { currentRoom.bannedUsers }</p>
                <p>muted users: { currentRoom.mutedUsers }</p>
            </div> */}
            <div className="contactPlay flex-item">
                <span><FontAwesomeIcon className="searchIcon" icon={faGear} onClick={openSettings} /></span>
                <span><FontAwesomeIcon icon={0 ? faBell : faBellSlash} /></span>
                <span><FontAwesomeIcon icon={faRightFromBracket} /></span>
            </div>
            { showSettings && <RoomSettings onClose={closeSettings} currentRoom={currentRoom} />}
    </div>
  )
}
