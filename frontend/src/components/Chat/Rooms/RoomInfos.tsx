import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBellSlash, faRightFromBracket, faGear } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { RoomSettings } from './RoomSettings';
import axios from 'axios';
import { useRoom } from '@/context/RoomsContext';

interface Room {
    id: number,
    roomName: string,
}

export const RoomInfos = ({ chatData }: any) => {
    const [contextRoom, updateRoom] = useRoom();
    const [showSettings, setShowSettings] = useState(false);
    const [roomAvatar, setRoomAvatar] = useState('');
    const currentRoom: Room = chatData?._chat?.chat


    const openSettings = () => {
      setShowSettings(true);
    };
      
    const closeSettings = () => {
      setShowSettings(false);
    };


    useEffect(() => {
        const fetchRoomAvatar = async () => {
            try {
                await axios.get(`http://localhost:8000/room/roomAvatar/${currentRoom.id}`, {withCredentials: true})
                setRoomAvatar(`http://localhost:8000/room/roomAvatar/${currentRoom.id}`);
            }
            catch (err) {
                console.log('No latest messages');
            }
        };

        fetchRoomAvatar();
    }, [currentRoom.id]);

    const leaveRoom = async () => {
        try {
            const _MAIN_USER_ = await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})
            const response = await axios.delete(`http://localhost:8000/roomUsers/${currentRoom.id}/${_MAIN_USER_?.data?.id}`, {
                withCredentials: true,
            });
            console.log(_MAIN_USER_?.data?.username , 'Kicked', response)
            chatData?._socket?.emit('leaveRoom', chatData?._chat?.chat)
            console.log('------ : ', contextRoom)
            updateRoom(!contextRoom);
            console.log('+++++++ : ', contextRoom)
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="contactInfo">
                <div className="contactInfos">
                    
                    <div className="contactAvatar">
                        <img className='contact-avatar' src={ roomAvatar } alt="room_avatar" />
                    </div>
                    <span>{ currentRoom.roomName }</span>
                </div>

                <div className="contactPlay2">
                    <div className="section2">
                        <FontAwesomeIcon className="info-icon" icon={faGear} onClick={openSettings} />
                        <FontAwesomeIcon className="info-icon" icon={0 ? faBell : faBellSlash} />
                        <FontAwesomeIcon className="info-icon" icon={faRightFromBracket} onClick={leaveRoom} />
                    </div>
                </div>
                { showSettings && <RoomSettings onClose={closeSettings} chatData={ chatData } /> }
        </div>
    )
}
