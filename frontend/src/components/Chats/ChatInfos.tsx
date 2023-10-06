import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faBellSlash, faUserSlash, faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useEffect, useState } from 'react';

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


    const addFriend = async () => {
        try {
            await axios.post(`http://localhost:8000/users/unblock-friend/${currentUser?.receiver?.id}`, {withCredentials: true})
        }
        catch (err) {
            console.log(`Coudn't add friend: `, err)
        }
        console.log(currentUser?.receiver?.id, 'added!')
    }

    const removeFriend = async () => {
        try {
            await axios.post(`http://localhost:8000/users/block-friend/${currentUser?.receiver?.id}`, {withCredentials: true})
        }
        catch (err) {
            console.log(`Coudn't remove friend: `, err)
        }
        console.log(currentUser?.receiver?.id, 'removed!')
    }

    const muteFriend = async () => {
        try {
            await axios.post(`http://localhost:8000/users/mute-friend/${currentUser?.receiver?.id}`, {withCredentials: true})
        }
        catch (err) {
            console.log(`Coudn't add friend: `, err)
        }
        console.log(currentUser?.receiver?.id, 'added!')
    }

    const unmuteFriend = async () => {
        try {
            await axios.post(`http://localhost:8000/users/unmute-friend/${currentUser?.receiver?.id}`, {withCredentials: true})
        }
        catch (err) {
            console.log(`Coudn't remove friend: `, err)
        }
        console.log(currentUser?.receiver?.id, 'removed!')
    }

    // console.log('FF', isFriend)
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
                        {/* <span><FontAwesomeIcon icon={0 ? faBell : faBellSlash} onClick={!isFriend ? unmuteFriend : muteFriend} /></span> */}
                        <span><FontAwesomeIcon icon={!isFriend ? faUser : faUserSlash} onClick={!isFriend ? addFriend : removeFriend} /></span>
                    </div>
                </div>
        </div>
    )
}
