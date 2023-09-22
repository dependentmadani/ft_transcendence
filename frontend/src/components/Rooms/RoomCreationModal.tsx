import  { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faPaperPlane, faImage, faUserPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { SearchInviteResults } from './SearchInviteResults';
import { RoomFormInvite } from './RoomFormIvite';

interface User {}

interface Room {}

export const RoomCreationModal = ({ onClose }: any) => {

    let fileUploaded: File;
    const [roomName, setRoomName] = useState('')
    const [roomAvatar, setRoomAvatar] = useState<File | null>()
    const [roomType, setRoomType] = useState('')
    const [searchResults, setSearchResults] = useState<User | null>([])
    const [username, setUsername] = useState('')

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        setRoomAvatar(file);
        // localStorage.setItem('local_storage', file)
    };

    useEffect(() => {
        getResults()
    }, [username])

    // const createRoom = (file: FileList | null) => {
    //     if (roomName && file) {
    //         if (file[0].size > 200000) {
    //             // setErrorMessageFile("Image size is limited to 20 kb!")
    //             return ;
    //         }
    //         fileUploaded = file[0];
    //         // setErrorMessageFile("");
    //         const fileRef= file[0] || ""
    //         const fileType = fileRef.type
    //         const reader = new FileReader()
    //         reader.readAsBinaryString(fileRef)
    //         reader.onload=(ev: any) => {
    //             setRoomAvatar(`data:${fileType};base64,${btoa(ev.target.result)}`)
    //         }
    //         axios({
    //             method: "POST",
    //             withCredentials: true,
    //             url: `http://localhost:8000/room`,
    //             headers: {'Content-Type':'multipart/form-data'},
    //             data: {
    //                 roomName: roomName,
    //                 roomAvatar: fileUploaded,
    //                 roomType: roomType,
    //             },
    //         });
    //     }
    // }

    const uploadImage = async () => {
        if (roomName && roomAvatar) {
            let formData = new FormData();
            formData.append('roomName', roomName);
            formData.append('roomAvatar', roomAvatar);
            formData.append('roomType', roomType)
            // formData.append('roomUsers', '1');
            // formData.append('role', 'ADMIN');
            console.log('hhh', formData)

        try {
            const response = await axios.post(`http://localhost:8000/room`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('CREATED ROOM ', response)

            if (response.data) {
                console.log('rah mzyaaan')
                const roomId: number = response.data.id
                const userId: number = 1 // for now
                try {
                    const response = await axios.post(`http://localhost:8000/roomUsers`, {
                        roomId: roomId,
                        userId: userId,
                        role: 'OWNER',
                    }, {
                        withCredentials: true
                    });
        
                    // if (response.data.imagePath) {
                    //     console.log('rah mzyaaan')
                    // }
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
          const results = await axios.get(`http://localhost:8000/users/search/${username}`, {withCredentials: true})
          setSearchResults(results.data)
        }
        catch {
            setSearchResults(null)
          console.error(`Couldn't find any user`)
        }
    }

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomType(event.target.value);
    };
    
    // console.log('CCCCURENT ROOM', currentRoom)

    return (
        <div className="overlay">
            <div className="form-container">
                <h2>Create New Room</h2>
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
                    <div className='roomType'>
                        <label>
                            <input type="radio" value="Public" checked={roomType === 'Public'} onChange={handleOptionChange} />
                            public
                        </label>

                        <label>
                            <input type="radio" value="Protected" checked={roomType === 'Protected'} onChange={handleOptionChange} />
                            protected
                        </label>

                        <label>
                            <input type="radio" value="Private" checked={roomType === 'Private'} onChange={handleOptionChange} />
                            private
                        </label>

                        <p>Selected Option: {roomType}</p>
                    </div>
                    

                    {/* { <RoomFormInvite currentRoom={currentRoom} /> } */}
                    {/* <div className="roomFormInvite">
                        <div className="searchInvite">
                            <input type="text" placeholder="Invite a user" onChange={e => setUsername(e.target.value)} />
                            <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} onClick={ getResults } />
                        </div>
                    </div> */}
                    <span className='sendIcon' onClick={uploadImage} ><FontAwesomeIcon icon={faPaperPlane} /></span>
                </div>
            </div>
            <span onClick={onClose}><FontAwesomeIcon icon={faCircleXmark} /></span>
        </div>
    );
};
