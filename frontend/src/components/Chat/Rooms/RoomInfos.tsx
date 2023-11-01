import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBellSlash, faRightFromBracket, faGear } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { RoomSettings } from './RoomSettings';
import axios from 'axios';

interface Room {
    id: number,
    roomName: string,
}

export const RoomInfos = ({ chatData }: any) => {
    
    const [showSettings, setShowSettings] = useState(false);
    // const [roomAvatar, setRoomAvatar] = useState('');
    const currentRoom: Contact = chatData?._chat


    const openSettings = () => {
      setShowSettings(true);
    };
      
    const closeSettings = () => {
      setShowSettings(false);
    };


    // useEffect(() => {
    //     const fetchRoomAvatar = async () => {
    //         try {
    //             await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/room/roomAvatar/${currentRoom.id}`, {withCredentials: true})
    //             setRoomAvatar(`http://${import.meta.env.VITE_BACK_ADDRESS}/room/roomAvatar/${currentRoom.id}`);
    //         }
    //         catch (err) {
    //             console.log('No latest messages');
    //         }
    //     };

    //     fetchRoomAvatar();
    // }, [currentRoom.id]);

    const leaveRoom = async () => {
        try {
            // const _MAIN_USER_ = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})
            console.log('current room', currentRoom)
            await axios.delete(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/${currentRoom.id}/${chatData._mainUser.id}`, {
                withCredentials: true,
            });
            // chatData?._socket?.emit('leaveRoom', {roomId: currentRoom.id, owner: chatData.mainUser.id})
            // const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/room/${currentRoom.id}`, {withCredentials: true})
            // if (res.data.length === 1 && res.data[0].role !== 'OWNER' && res.data[0].role !== 'ADMIN') {
            //     await axios.patch(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/${currentRoom.id}/${res?.data[0]?.userId}`, {
            //         'role': 'ADMIN',
            //     }, {
            //         withCredentials: true,
            //     });
            // }
        } catch (error) {
            console.log(error);
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
                        <FontAwesomeIcon className="info-icon" icon={0 ? faBell : faBellSlash} />
                        <a><FontAwesomeIcon className="info-icon" icon={faRightFromBracket} onClick={leaveRoom} /></a>
                    </div>
                </div>
                { showSettings && <RoomSettings onClose={closeSettings} chatData={ chatData } /> }
        </div>
    )
}
