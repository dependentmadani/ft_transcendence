import  { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// interface User {}


export const RoomCreationModal = ({ onClose, chatData }: any) => {

    const [roomName, setRoomName] = useState('')
    const [roomAvatar, setRoomAvatar] = useState<File | null>()
    const [roomType, setRoomType] = useState('')
    const [roomPass, setRoomPass] = useState('')
    const searchResultsRef = useRef<HTMLDivElement>(null);

    
    // handling the opening and the closing of the form
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
    

    // Getting the Room avatar from the user
    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        setRoomAvatar(file);
    };


    // Creating the new Room
    const uploadImage = async () => {
        if (roomName && roomAvatar) {
            let formData = new FormData();
            formData.append('roomName', roomName);
            formData.append('roomAvatar', roomAvatar);
            formData.append('roomType', roomType)
            formData.append('roomPass', roomPass)

            try {
                const response = await axios.post(`http://localhost:8000/room`, formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                
                const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
                
                console.log('main user', _MAIN_USER_.id)
                chatData?._socket?.emit('createRoom', {room: response.data, owner: _MAIN_USER_.id})
                console.log('CREATED ROOM ', response)

                if (response.data) {
                    console.log('rah mzyaaan')
                    const roomId: number = response.data.id
                    try {
                        const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
                        await axios.post(`http://localhost:8000/roomUsers`, {
                            roomId: roomId,
                            userId: _MAIN_USER_.id,
                            role: 'OWNER',
                            allowed: roomType === 'Private' ? false : true,
                        }, {
                            withCredentials: true
                        });
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    };


    // Setting Room type
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomType(event.target.value);
    };
    

    return (
        <div className="overlay">
            <div className="form-container" ref={searchResultsRef}>
                <h2 className='change-room-name'>Create New Room</h2>
                <div className="roomFomrs">
                    <div className="roomFormInfos">
                        <input type="text" className='room-creation-input' placeholder="Room name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                        <span>
                            <label htmlFor="image-upload" className="upload-label">
                                <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                <div className="upload-icon">
                                    <FontAwesomeIcon className='importAvatarIcon' icon={faImage} />
                                </div>
                            </label>
                        </span>
                    </div>
                    <div className='roomType'>
                        <span>
                            <input type="radio" value="Public" checked={roomType === 'Public'} onChange={handleOptionChange} />
                            public
                        </span>
                        <span>
                            <input type="radio" value="Protected" checked={roomType === 'Protected'} onChange={handleOptionChange} />
                            protected
                        </span>
                        <span>
                            <input type="radio" value="Private" checked={roomType === 'Private'} onChange={handleOptionChange} />
                            private
                        </span>
                    </div>
                    { roomType === 'Private' && <input type="text" className='room-creation-pass-input' placeholder="Room password" value={roomPass} onChange={(e) => setRoomPass(e.target.value)} />}
                    <span className='saveChanges' onClick={ uploadImage }>save</span>
                </div>
                {/* <div className="sendButton">
                    <FontAwesomeIcon className='createIconSend' onClick={uploadImage} icon={faPaperPlane} />
                </div> */}
            </div>
        </div>
    );
};
