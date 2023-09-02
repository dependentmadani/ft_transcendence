import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBellSlash, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

// interface User {
//     id: number;
//     username: string;
//     avatar: string,
// }

export const RoomInfos = ({ currentRoom }: any) => {

  return (
    <div className="contactInfo container-flex">
            <div className="contactInfos flex-item">
                <div className="contactAvatar">
                    <img src={ currentRoom.roomAvatar } alt="room_avatar" />
                </div>
                <span>{ currentRoom.roomName }</span>
                {/* <div className="contactPlay">
                    <span><FontAwesomeIcon icon={faTableTennisPaddleBall} /></span>
                    <span><FontAwesomeIcon icon={faUser} /></span>
                </div> */}
            </div>

            <div className="mutualContact flex-item">
                <p>members</p>
                <p>room admin: { currentRoom.roomUsers }</p>
                <p>room users: { currentRoom.roomUsers }</p>
                <p>kicked users: { currentRoom.kickedUsers }</p>
                <p>baned users: { currentRoom.bannedUsers }</p>
                <p>muted users: { currentRoom.mutedUsers }</p>
                {/* <div className="mutualFriends">
                    <p>mutual Friends</p>
                    <div className="mutualFriendsContainer">
                        <ul>
                            <li>gg</li>
                            <li>gg</li>
                            <li>gg</li>
                            <li>gg</li>
                            <li>gg</li>
                        </ul>
                    </div>
                </div>
                <div className="mutualGroups">
                    <p>mutual Groups</p>
                    <div className="mutualGroupssContainer">
                        <ul>
                            <li>gg</li>
                            <li>gg</li>
                            <li>gg</li>
                        </ul>
                    </div>
                </div> */}
            </div>
            <div className="contactPlay flex-item">
                {/* <button>mute</button>
                <button>block</button> */}
                <span><FontAwesomeIcon icon={0 ? faBell : faBellSlash} /></span>
                <span><FontAwesomeIcon icon={faRightFromBracket} /></span>
            </div>
    </div>
  )
}
