import  { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faPaperPlane, faImage, faUserPlus } from '@fortawesome/free-solid-svg-icons';

export const RoomCreationModal = ({ onClose }: any) => {

    const [roomName, setRoomName] = useState('')
    const [roomAvatar, setRoomAvatar] = useState('')

    const handleClick = () => {
        if (roomName.trim() !== '' && roomAvatar) {
            // we create a room
            console.log('room name: ', roomName, ' | room avatar', roomAvatar)
            setRoomName('')
            setRoomAvatar('')
        }
    }

    // const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        setRoomAvatar(file);
    };

    // console.log('room name is ', roomName)
    console.log('room name: ', roomName, ' | room avatar', roomAvatar)

    return (
        <div className="overlay">
        <div className="form-container">
            <h2>Fill the Form wlla sir tl3ab</h2>
            <div className="roomFomrs">
                <div className="roomFormInfos">
                    <input type="text" placeholder="Room name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                    <span>
                        {/* <FontAwesomeIcon className='importAvatarIcon' icon={faImage} /> */}
                        <label htmlFor="image-upload" className="upload-label">
                            <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            />
                            <div className="upload-icon">
                            {/* <FaImage size={30} />*/}
                            <FontAwesomeIcon className='importAvatarIcon' icon={faImage} />
                            </div>
                        </label>
                    </span>
                    {roomAvatar && <img src={URL.createObjectURL(roomAvatar)} alt="Uploaded" />}
                </div>
                <div className="roomFormInvite">
                    {/* <span> */}
                        <input type="text" placeholder="Invite a user" /*onKeyDown={handleKey} onChange={e => setUsername(e.target.value)}*/ />
                        {/* <CreateRoom /> */}
                        <div className="searchInviteResults">
                            <div className="searchInviteResult">
                                <p>name</p>
                                <FontAwesomeIcon className="inviteIcon" icon={faUserPlus} />
                            </div>
                        </div>
                    {/* </span> */}
                {/* <input type="text" placeholder="Room name" value={roomName} onChange={(e) => setRoomName(e.target.value)} /> */}
                </div>
                {/* Your form elements here */}
                <span onClick={handleClick}><FontAwesomeIcon icon={faPaperPlane} /></span>
            </div>
        </div>
        <span onClick={onClose}><FontAwesomeIcon icon={faCircleXmark} /></span>
        </div>
    );
};
