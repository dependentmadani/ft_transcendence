import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faFloppyDisk, faImage, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SearchInviteResults } from './SearchInviteResults';
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

    // const [searchResults, setSearchResults] = useState<User | null>([])
    // const [username, setUsername] = useState('')
    const [roomMembers, setRoomMembers] = useState<User[] | null>([])
    const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false)
    
    // const getResults = async () => {
    //     try {
    //       const results = await axios.get(`http://localhost:8000/users/search/${username}`)
    //       setSearchResults(results.data)
    //     }
    //     catch {
    //         setSearchResults(null)
    //       console.error(`Couldn't find any user`)
    //     }
    // }
    useEffect(() => {
        const isCurrentUserAdmin = async () => {
            const currentUserId: number = 1 // for now
            const roomAdmins = await axios.get(`http://localhost:8000/roomUsers/admins/${currentRoom.id}`)
            let t: number[] = []
                
            roomAdmins.data.map((roomUser: RoomUsers) => (
                t.push(roomUser.userId)
            ))
            console.log('T ', t)
                
            for (let i=0; i<t.length; i++)
                if (t[i] === currentUserId)
                    setCurrentUserIsAdmin(true)
        }
        isCurrentUserAdmin()
    }, [currentRoom.id])

    useEffect(() =>{
        const getRoomMembers = async () => {
            try {
                const result = await axios.get(`http://localhost:8000/roomUsers/${currentRoom?.id}`)
                console.log('yyyy', currentRoom.id)
                if (result.data) {
                    let membersIds: number[] = []
                    result.data.map((member: RoomUsers) => (
                        membersIds.push(member?.userId)
                    ))
                    let members: User[] = []
                    for (let i=0; i<membersIds.length; i++) {
                        try {
                            const user = await axios.get(`http://localhost:8000/users/${membersIds[i]}`)
                            members.push(user.data)
                        }
                        catch (err) {
                            console.error(`Couldn't fetch any user`)
                        }
                    }
                    setRoomMembers(members)
                }
            }
            catch {
                console.error('No users for this room')
            }
        }
        getRoomMembers()
    }, [])

    const [newRoomType, setNewRoomType] = useState(currentRoom.roomType)
    const [newRoomName, setNewRoomName] = useState('')
    const [newRoomAvatar, setNewRoomAvatar] = useState<File | null>(null)
    // const [selectedOption, setSelectedOption] = useState<string>();
    // const isOptionSelected = (optionValue: string) => {
    //     return selectedOption === optionValue;
    // };
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewRoomType(event.target.value);
    };

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        setNewRoomAvatar(file);
    };

    const saveChanges = async () => {
        console.log('New room name: ', newRoomName)
        console.log('New room avatar: ', newRoomAvatar)
        console.log('New room type: ', newRoomType)

        if (newRoomName && newRoomAvatar) {
            let formData = new FormData();
            formData.append('roomName', newRoomName);
            formData.append('roomAvatar', newRoomAvatar);
            formData.append('roomType', newRoomType)

        try {
            const response = await axios.patch(`http://localhost:8000/room/${currentRoom.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Updated ROOM ', response.data)
            
        } catch (error) {
            console.error(error);
        }
        }
    }

    console.log('ROOM MEMBERS ', roomMembers, currentUserIsAdmin)
    console.log(currentRoom)

    return (
        <div className="overlay">
            <div className="form-container">
                { currentUserIsAdmin && <RoomFormInvite currentRoom={currentRoom} /> }
                {/* <div className="roomFormInvite">
                        <div className="searchInvite">
                            <input type="text" placeholder="Invite a user" onChange={e => setUsername(e.target.value)} />
                            <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} onClick={ getResults } />
                        </div>
                        { searchResults && <SearchInviteResults currentRoom={currentRoom} searchResults={searchResults} /> }
                </div> */}
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
                            <input type="radio" value="public" checked={newRoomType === 'public'} onChange={handleOptionChange} />
                            public
                        </label>

                        <label>
                            <input type="radio" value="protected" checked={newRoomType === 'protected'} onChange={handleOptionChange} />
                            protected
                        </label>

                        <label>
                            <input type="radio" value="private" checked={newRoomType === 'private'} onChange={handleOptionChange} />
                            private
                        </label>
                    </div>
                    {/* <p>Room Name: { currentRoom.roomName }</p>
                    <p>Room Type: { currentRoom.roomType } </p> */}
                    <span className='saveChanges'><FontAwesomeIcon className="saveChangesIcon" icon={faFloppyDisk} onClick={ saveChanges } /></span>
                </div>
                <div className="mutualContact flex-item">
                    
                    {/* <p>members</p>
                    {
                        roomMembers?.map((user: User) => (
                            <p>{ user.username }</p>
                        ))
                    } */}
                    <RoomMembers currentRoom={currentRoom} />
                    {/* <RoomAdmins currentRoom={currentRoom} />
                    <p>room users: { currentRoom.roomMembers }</p>
                    <p>kicked users: { currentRoom.kickedUsers }</p>
                    <p>baned users: { currentRoom.bannedUsers }</p>
                    <p>muted users: { currentRoom.mutedUsers }</p> */}
                </div>
            </div>
            <span onClick={onClose}><FontAwesomeIcon icon={faCircleXmark} /></span>
        </div>
    );
};
