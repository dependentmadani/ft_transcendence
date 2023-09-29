import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faFloppyDisk, faImage } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { RoomMembers } from './RoomMembers';
import { RoomFormInvite } from './RoomFormIvite';

interface User {
    username: string,
}

interface RoomUsers {
    roomId: number,
    userId: number,
    role: string
}

export const RoomSettings = ({ currentRoom, onClose }: any) => {

    // const [roomMembers, setRoomMembers] = useState<User[] | null>([])
    const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false)
    const [newRoomType, setNewRoomType] = useState(currentRoom.roomType)
    const [newRoomName, setNewRoomName] = useState('')
    const [newRoomAvatar, setNewRoomAvatar] = useState<File | null>(null)

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

    // useEffect(() =>{
    //     const getRoomMembers = async () => {
    //         try {
    //             const result = await axios.get(`http://localhost:8000/roomUsers/${currentRoom?.id}`, {withCredentials: true})
    //             console.log('yyyy', currentRoom.id)
    //             if (result.data) {
    //                 let membersIds: number[] = []
    //                 result.data.map((member: RoomUsers) => (
    //                     membersIds.push(member?.userId)
    //                 ))
    //                 let members: User[] = []
    //                 for (let i=0; i<membersIds.length; i++) {
    //                     try {
    //                         const user = await axios.get(`http://localhost:8000/users/${membersIds[i]}`, {withCredentials: true})
    //                         members.push(user.data)
    //                     }
    //                     catch (err) {
    //                         console.error(`Couldn't fetch any user`)
    //                     }
    //                 }
    //                 setRoomMembers(members)
    //             }
    //         }
    //         catch {
    //             console.error('No users for this room')
    //         }
    //     }
    //     getRoomMembers()
    // }, [])

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
            
        } catch (error) {
            console.error(error);
        }
        }
    }

    // console.log('ROOM MEMBERS ', currentUserIsAdmin)
    // console.log(currentRoom.roomType)
    const searchResultsRef = useRef<HTMLDivElement>(null);

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
                { currentUserIsAdmin && <RoomFormInvite currentRoom={currentRoom} /> }
                <div className="changeRoomSettings">
                    <p>Change room settings</p>
                    <div className="mainInfos">
                        <input type="text" placeholder={ currentRoom.roomName } onChange={e => setNewRoomName(e.target.value)} />
                        <span>
                            <label htmlFor="image-upload" className="upload-label">
                                <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                />
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
                    <span className='saveChanges'><FontAwesomeIcon className="saveChangesIcon" icon={faFloppyDisk} onClick={ saveChanges } /></span>
                </div>
                <div className="mutualContact flex-item">
                    <RoomMembers currentRoom={currentRoom} />
                </div>
            </div>
            {/* <span onClick={onClose}><FontAwesomeIcon icon={faCircleXmark} /></span> */}
        </div>
    );
};
