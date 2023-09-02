import  { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faPaperPlane, faImage, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export const RoomCreationModal = ({ onClose }: any) => {

    const [roomName, setRoomName] = useState('')
    const [roomAvatar, setRoomAvatar] = useState<File | null>(null)

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        setRoomAvatar(file);
    };

    const uploadImage = async () => {
        if (roomAvatar) {
            let formData = new FormData();
            formData.append('roomName', roomName);
            formData.append('roomAvatar', roomAvatar);
            formData.append('roomUsers', '1');
            formData.append('role', 'ADMIN');
            console.log('hhh', formData)

        try {
            const response = await axios.post('http://localhost:8000/room', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.imagePath) {
                console.log('rah mzyaaan')
            }
        } catch (error) {
            console.error(error);
        }
        }
    };

    return (
        <div className="overlay">
        <div className="form-container">
            <h2>Fill the Form wlla sir tl3ab</h2>
            <div className="roomFomrs">
                <div className="roomFormInfos">
                    <input type="text" placeholder="Room name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
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
                                <FontAwesomeIcon className='importAvatarIcon' icon={faImage} />
                            </div>
                        </label>
                    </span>
                </div>
                <div className="roomFormInvite">
                        <input type="text" placeholder="Invite a user" /*onKeyDown={handleKey} onChange={e => setUsername(e.target.value)}*/ />
                        <div className="searchInviteResults">
                            <div className="searchInviteResult">
                                <p>name</p>
                                <FontAwesomeIcon className="inviteIcon" icon={faUserPlus} />
                            </div>
                        </div>
                </div>
                <span onClick={uploadImage}><FontAwesomeIcon icon={faPaperPlane} /></span>
            </div>
        </div>
        <span onClick={onClose}><FontAwesomeIcon icon={faCircleXmark} /></span>
        </div>
    );
};
