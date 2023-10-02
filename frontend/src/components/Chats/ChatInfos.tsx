import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faBellSlash, faUserSlash, faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';

export const ChatInfos = ({ currentUser }: any) => {

    const addFriend = () => {
        console.log('add friend')
    }
    const removeFriend = () => {
        console.log('remove friend')
    }

    return (
        <div className="contactInfo">
                <div className="contactInfos">
                    <div className="contactAvatar">
                        <img src={ currentUser?.receiver?.avatar } alt="user_avatar" />
                    </div>
                    <span>{ currentUser?.receiver?.username }</span>
                    <div className="contactPlay1">
                        <span><FontAwesomeIcon icon={faTableTennisPaddleBall} /></span>
                        <span><FontAwesomeIcon icon={faUser} /></span>
                    </div>
                </div>
                <div className="contactPlay2">
                    <div className="section2">
                        <span><FontAwesomeIcon icon={0 ? faBell : faBellSlash} /></span>
                        <span><FontAwesomeIcon icon={0 ? faUser : faUserSlash} onClick={0 ? addFriend : removeFriend}/></span>
                    </div>
                </div>
        </div>
    )
}
