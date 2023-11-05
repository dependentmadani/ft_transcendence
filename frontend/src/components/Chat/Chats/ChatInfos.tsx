import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { GameInviteForm } from './GameInviteForm';



export const ChatInfos = ({ chatData }: any) => {


    
    const _receiver: User = chatData?._receiver

    const [showForm, setShowForm] = useState(false);

    const openForm = () => {
      setShowForm(true);
    };
    
    const closeForm = () => {
      setShowForm(false);
    };
    

    return (
        <div className="contactInfo">
                <div className="contactInfos">
                    <div className="contactAvatar">
                        <img className="contact-avatar" src={ _receiver?.avatar } alt="user_avatar" />
                    </div>
                    <span>{ _receiver?.username }</span>
                    <div className="contactPlay1">
                        <a href='#' ><FontAwesomeIcon className="info-icon" onClick={openForm} icon={faTableTennisPaddleBall} /></a>
                        <a href={`http://${import.meta.env.VITE_FRONT_ADDRESS}/profile/${_receiver?.username}`} ><FontAwesomeIcon className="info-icon" icon={faUser} /></a>
                    </div>
                </div>
                <div className="contactPlay2">
                    {/* <div className="section2">
                        <FontAwesomeIcon className="info-icon" icon={0 ? faBell : faBellSlash} onClick={isFriend ? unmuteFriend : muteFriend} />
                    </div> */}
                </div>
                { showForm && <GameInviteForm onClose={closeForm} chatData={chatData} />}
        </div>
    )
}
