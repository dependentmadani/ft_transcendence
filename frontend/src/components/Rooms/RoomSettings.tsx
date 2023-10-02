import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faImage } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { RoomMembers } from './RoomMembers';
import { RoomFormInvite } from './RoomFormIvite';

interface RoomUsers {
    roomId: number,
    userId: number,
    role: string
}


export const RoomSettings = ({ currentRoom, onClose }: any) => {

    const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false)
    const [newRoomType, setNewRoomType] = useState(currentRoom?.roomType)
    const [newRoomName, setNewRoomName] = useState('')
    const [newRoomAvatar, setNewRoomAvatar] = useState<File | null>(null)
    const searchResultsRef = useRef<HTMLDivElement>(null);
    
    
    useEffect(() => {
        const isCurrentUserAdmin = async () => {
            if (currentRoom.roomType === 'Public' || currentRoom.roomType === 'Protected')
                setCurrentUserIsAdmin(true)
            else if (currentRoom.roomType === 'Private')
            {
                const currentUserId: number = 1 // for now
                const roomAdmins = await axios.get(`http://localhost:8000/roomUsers/admins/${currentRoom.id}`, {withCredentials: true})
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
        if (newRoomName && newRoomAvatar) {
            let formData = new FormData();
            formData.append('roomName', newRoomName);
            formData.append('roomAvatar', newRoomAvatar);
            formData.append('roomType', newRoomType)

            try {
                const response = await axios.patch(`http://localhost:8000/room/${currentRoom.id}`, formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log('Updated ROOM ', response.data)
                
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
                <h2>Change room settings</h2>
                { currentUserIsAdmin && <RoomFormInvite currentRoom={currentRoom} /> }
                <div className="changeRoomSettings">
                    <div className="changes">
                        <div className="mainInfos">
                            <input type="text" placeholder={ currentRoom.roomName } onChange={e => setNewRoomName(e.target.value)} />
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
                    </div>
                    <div className="saveIcon">
                        <span className='saveChanges'><FontAwesomeIcon className="saveChangesIcon" icon={faFloppyDisk} onClick={ saveChanges } /></span>
                    </div>
                </div>
                <div className="FormRoomMember">
                    <RoomMembers currentRoom={currentRoom} />
                </div>
            </div>
        </div>
    );
};
