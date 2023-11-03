import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { RoomMembers } from './RoomMembers';
import { RoomFormInvite } from './RoomFormIvite';



export const RoomSettings = ({ chatData, onClose }: any) => {

    const currentRoom: Contact = chatData?._chat
    const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false)
    const [newRoomType, setNewRoomType] = useState(currentRoom.protection)
    const [newRoomName, setNewRoomName] = useState('')
    const [newRoomAvatar, setNewRoomAvatar] = useState<File | null>(null)
    const [newRoomPass, setNewRoomPass] = useState('')
    const searchResultsRef = useRef<HTMLDivElement>(null);
    
    
    useEffect(() => {
        const isCurrentUserAdmin = async () => {
            if (currentRoom.protection === 'Public')
                setCurrentUserIsAdmin(true)
            else if (currentRoom.protection === 'Protected' || currentRoom.protection === 'Private')
            {
                const isAdmin = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/is-admin/${currentRoom.id}/${chatData._mainUser.id}`, {withCredentials: true})).data
                if (isAdmin)
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
            window.location.reload()
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
                            <input type="text" className='form-invite-input' placeholder={ currentRoom.name } onChange={e => setNewRoomName(e.target.value)} />
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
                                <input type="radio" value="Private" checked={newRoomType === 'Private'} onChange={handleOptionChange} />
                                Private
                            </label>

                            <label>
                                <input type="radio" value="Protected" checked={newRoomType === 'Protected'} onChange={handleOptionChange} />
                                Protected
                            </label>
                        </div>
                        { newRoomType === 'Protected' && <input type="password" className='form-invite-input' placeholder="Room password" value={newRoomPass} onChange={(e) => setNewRoomPass(e.target.value)} />}
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
