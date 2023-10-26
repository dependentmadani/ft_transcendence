import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { RoomMembers } from './RoomMembers';
import { RoomFormInvite } from './RoomFormIvite';

interface RoomUsers {
    roomId: number,
    userId: number,
    role: string
}

interface Room {
    id: number,
    roomName: string,
    roomType: string,
}

export const RoomSettings = ({ chatData, onClose }: any) => {

    const currentRoom: Room = chatData?._chat?.chat
    const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false)
    const [newRoomType, setNewRoomType] = useState(currentRoom?.roomType)
    const [newRoomName, setNewRoomName] = useState('')
    const [newRoomAvatar, setNewRoomAvatar] = useState<File | null>(null)
    const [newRoomPass, setNewRoomPass] = useState('')
    const searchResultsRef = useRef<HTMLDivElement>(null);
    
    
    useEffect(() => {
        const isCurrentUserAdmin = async () => {
            if (currentRoom.roomType === 'Public' || currentRoom.roomType === 'Protected')
                setCurrentUserIsAdmin(true)
            else if (currentRoom.roomType === 'Private')
            {
                const _MAIN_USER_ = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
                const currentUserId: number = _MAIN_USER_.id
                const roomAdmins = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/admins/${currentRoom.id}`, {withCredentials: true})
                let t: number[] = []
                    
                roomAdmins.data.map((roomUser: RoomUsers) => (
                    t.push(roomUser.userId)
                ))
                
                for (let i=0; i<t.length; i++)
                    if (t[i] === currentUserId)
                        setCurrentUserIsAdmin(true)
            }
        }

        isCurrentUserAdmin()
    }, [currentRoom.id])


    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewRoomType(event.target.value);
    };

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        setNewRoomAvatar(file);
    };

    const saveChanges = async () => {
        if (newRoomName && newRoomAvatar && newRoomPass) {
            let formData = new FormData();
            formData.append('roomName', newRoomName);
            formData.append('roomAvatar', newRoomAvatar);
            formData.append('roomType', newRoomType)
            formData.append('roomPass', newRoomPass)

            try {
                await axios.patch(`http://${import.meta.env.VITE_BACK_ADDRESS}/room/${currentRoom.id}`, formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                
            }
            catch (error) {
                console.log(error);
            }
        }
    }


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="overlay">
            <div className="form-container" ref={searchResultsRef}>
                <h2 className='change-settings'>Change room settings</h2>
                { currentUserIsAdmin && <RoomFormInvite chatData={ chatData } /> }
                <div className="changeRoomSettings">
                    <div className="changes">
                        <div className="mainInfos">
                            <input type="text" className='form-invite-input' placeholder={ currentRoom.roomName } onChange={e => setNewRoomName(e.target.value)} />
                            <span>
                                <label htmlFor="image-upload" className="upload-label">
                                    <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                    <div className="upload-icon">
                                        <FontAwesomeIcon className='importNewAvatarIcon' icon={faImage} />
                                    </div>
                                </label>
                            </span>
                        </div>
                        <div className='roomType'>
                            <label>
                                <input type="radio" value="Public" checked={newRoomType === 'Public'} onChange={handleOptionChange} />
                                Public
                            </label>

                            <label>
                                <input type="radio" value="Protected" checked={newRoomType === 'Protected'} onChange={handleOptionChange} />
                                Protected
                            </label>

                            <label>
                                <input type="radio" value="Private" checked={newRoomType === 'Private'} onChange={handleOptionChange} />
                                Private
                            </label>
                        </div>
                        { newRoomType === 'Private' && <input type="text" className='form-invite-input' placeholder="Room password" value={newRoomPass} onChange={(e) => setNewRoomPass(e.target.value)} />}
                    </div>
                    <div className="saveIcon">
                        <span className='saveChanges' onClick={ saveChanges }>save</span>
                    </div>
                </div>
                <div className="FormRoomMember">
                    <RoomMembers chatData={ chatData } />
                </div>
            </div>
        </div>
    );
};
