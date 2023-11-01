import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faBellSlash, faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GameInviteForm } from './GameInviteForm';
import { useSocket } from "@/context/socketContext";

// interface User {}

export const ChatInfos = ({ chatData }: any) => {

    // const [isFriend, setIsFriend] = useState(false)
    

    // const currentUser: User = chatData?._receiver
    const _receiver: User = chatData?._receiver
    // useEffect(() => {
    //     const getFriends = async () => {
    //         try {
    //             const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/mutual-friends/${currentUser?.receiver?.id}`, {withCredentials: true})
    //             // console.log('Friends', isFriend)

    //                 if (res.data.length !== 0)
    //                     setIsFriend(true)
    //         }
    //         catch (err) {
    //             console.log(`Coudn't fetch friends: `, err)
    //         }
    //     }

    //     getFriends()
    // }, [currentUser])


    
    // const muteFriend = async () => {
    //     try {
    //         await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/block-friend/${currentUser?.receiver?.id}`, { withCredentials: true,})
    //         console.log(currentUser?.receiver?.id, 'blocked!')
    //     }
    //     catch (err) {
    //         console.log(`Coudn't block friend: `, err)
    //     }
    // }

    // const unmuteFriend = async () => {
    //     try {
    //         await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/unblock-friend/${currentUser?.receiver?.id}`, {withCredentials: true})
    //     }
    //     catch (err) {
    //         console.log(`Coudn't unblock friend: `, err)
    //     }
    //     console.log(currentUser?.receiver?.id, 'unblocked')
    // }

    // console.log('chat info', currentUser)
    const [showForm, setShowForm] = useState(false);

    const openForm = () => {
      setShowForm(true);
    };
    
    const closeForm = () => {
      setShowForm(false);
    };

    console.log('HA LI WSALNA HAD SA3A', _receiver)

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
