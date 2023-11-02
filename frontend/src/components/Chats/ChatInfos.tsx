import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faBellSlash, faUserSlash, faTableTennisPaddleBall, faMessage } from '@fortawesome/free-solid-svg-icons';

// interface User {
//     id: number;
//     username: string;
//     avatar: string,
// }


export const ChatInfos = ({ currentUser }: any) => {
    
    console.log('current user:', currentUser)

    const addFriend = () => {
        console.log('add friend')
    }
    const removeFriend = () => {
        console.log('remove friend')
    }
    
  return (
    <div className="contactInfo container-flex">
            <div className="contactInfos flex-item">
                <div className="contactAvatar">
                    <img src={ currentUser?.receiver?.avatar } alt="user_avatar" />
                </div>
                <span>{ currentUser?.receiver?.username }</span>
                <div className="contactPlay">
                    <span><FontAwesomeIcon icon={faTableTennisPaddleBall} /></span>
                    <span><FontAwesomeIcon icon={faUser} /></span>
                </div>
            </div>

            {/* <div className="mutualContact flex-item">
                <div className="mutualFriends">
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
                </div>
            </div> */}
            <div className="contactPlay flex-item">
                {/* <button>mute</button>
                <button>block</button> */}
                <span><FontAwesomeIcon icon={0 ? faBell : faBellSlash} /></span>
                <span><FontAwesomeIcon icon={0 ? faUser : faUserSlash} onClick={0 ? addFriend : removeFriend}/></span>
            </div>
    </div>
  )
}
