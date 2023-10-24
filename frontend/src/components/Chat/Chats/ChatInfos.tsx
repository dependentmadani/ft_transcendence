import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faBellSlash, faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const ChatInfos = ({ currentUser }: any) => {

    const [isFriend, setIsFriend] = useState(false)

    
    useEffect(() => {
        const getFriends = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/users/mutual-friends/${currentUser?.receiver?.id}`, {withCredentials: true})
                console.log('Friends', isFriend)

                    if (res.data.length !== 0)
                        setIsFriend(true)
            }
            catch (err) {
                console.log(`Coudn't fetch friends: `, err)
            }
        }

        getFriends()
    }, [currentUser])


    const muteFriend = async () => {
        try {
            await axios.post(`http://localhost:8000/users/block-friend/${currentUser?.receiver?.id}`, { withCredentials: true,})
            console.log(currentUser?.receiver?.id, 'blocked!')
        }
        catch (err) {
            console.log(`Coudn't block friend: `, err)
        }
    }

    const unmuteFriend = async () => {
        try {
            await axios.post(`http://localhost:8000/users/unblock-friend/${currentUser?.receiver?.id}`, {withCredentials: true})
        }
        catch (err) {
            console.log(`Coudn't unblock friend: `, err)
        }
        console.log(currentUser?.receiver?.id, 'unblocked')
    }

    // console.log('chat info', currentUser)

    return (
        <div className="contactInfo">
                <div className="contactInfos">
                    <div className="contactAvatar">
                        <img className="contact-avatar" src={ currentUser?.receiver?.avatar } alt="user_avatar" />
                    </div>
                    <span>{ currentUser?.receiver?.username }</span>
                    <div className="contactPlay1">
                        <a href='/play' ><FontAwesomeIcon className="info-icon" icon={faTableTennisPaddleBall} /></a>
                        <a href='/play' ><FontAwesomeIcon className="info-icon" icon={faTableTennisPaddleBall} /></a>
                        <a href='/profile' ><FontAwesomeIcon className="info-icon" icon={faUser} /></a>
                    </div>
                </div>
                <div className="contactPlay2">
                    <div className="section2">
                        <FontAwesomeIcon className="info-icon" icon={0 ? faBell : faBellSlash} onClick={isFriend ? unmuteFriend : muteFriend} />
                    </div>
                </div>
        </div>
    )
}
