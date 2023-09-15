import  { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faPaperPlane, faImage, faUserPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { SearchInviteResults } from './SearchInviteResults';

interface User {}

export const RoomCreationModal = ({ onClose }: any) => {

    const [roomName, setRoomName] = useState('')
    const [roomAvatar, setRoomAvatar] = useState<File | null>(null)
    const [searchResults, setSearchResults] = useState<User | null>([])
    const [username, setUsername] = useState('')

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        setRoomAvatar(file);
    };

    useEffect(() => {
        getResults()
    }, [username])

    const uploadImage = async () => {
        if (roomAvatar) {
            let formData = new FormData();
            formData.append('roomName', roomName);
            formData.append('roomAvatar', roomAvatar);
            // formData.append('roomUsers', '1');
            // formData.append('role', 'ADMIN');
            console.log('hhh', formData)

        try {
            const response = await axios.post('http://localhost:8000/room', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('CREATED ROOM ', response)

            if (response.data) {
                console.log('rah mzyaaan')
                const roomId: number = response.data.id
                const userId: number = 1
                try {
                    const response = await axios.post(`http://localhost:8000/roomUsers`, {
                        roomId: roomId,
                        userId: userId,
                        role: 'OWNER',
                    });
        
                    if (response.data.imagePath) {
                        console.log('rah mzyaaan')
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            
        } catch (error) {
            console.error(error);
        }
        }
    };

    // Search for Users to invite
    const getResults = async () => {
        try {
          const results = await axios.get(`http://localhost:8000/users/search/${username}`)
          setSearchResults(results.data)
        }
        catch {
            setSearchResults(null)
          console.error(`Couldn't find any user`)
        }
    }

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
                        <div className="searchInvite">
                            <input type="text" placeholder="Invite a user" onChange={e => setUsername(e.target.value)} />
                            <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} onClick={ getResults } />
                        </div>
                        { searchResults && <SearchInviteResults searchResults={searchResults} /> }
                    </div>
                    <span className='sendIcon' onClick={uploadImage}><FontAwesomeIcon icon={faPaperPlane} /></span>
                </div>
            </div>
            <span onClick={onClose}><FontAwesomeIcon icon={faCircleXmark} /></span>
        </div>
    );
};
