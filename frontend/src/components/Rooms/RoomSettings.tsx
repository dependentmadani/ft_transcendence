import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SearchInviteResults } from './SearchInviteResults';
import { RoomAdmins } from './RoomAdmins';
import { RoomMembers } from './RoomMembers';

interface User {
    username: string,
}

interface RoomUsers {
    roomId: number,
    userId: number,
    role: string
}

export const RoomSettings = ({ onClose, currentRoom }: any) => {

    const [searchResults, setSearchResults] = useState<User | null>([])
    const [username, setUsername] = useState('')
    const [roomMembers, setRoomMembers] = useState<User[] | null>([])
    
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

    useEffect(() =>{
        const getRoomMembers = async () => {
            try {
                const result = await axios.get(`http://localhost:8000/roomUsers/${currentRoom.id}`)
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

    console.log('ROOM USERS ', roomMembers)
    console.log(currentRoom)

    return (
        <div className="overlay">
            <div className="form-container">
                <p>{ currentRoom.roomName }</p>
                <div className="roomFormInvite">
                        <div className="searchInvite">
                            <input type="text" placeholder="Invite a user" onChange={e => setUsername(e.target.value)} />
                            <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} onClick={ getResults } />
                        </div>
                        { searchResults && <SearchInviteResults searchResults={searchResults} /> }
                </div>
                <div className="mutualContact flex-item">
                    {/* <p>members</p>
                    {
                        roomMembers?.map((user: User) => (
                            <p>{ user.username }</p>
                        ))
                    } */}
                    <RoomMembers currentRoom={currentRoom} />
                    <RoomAdmins currentRoom={currentRoom} />
                    <p>room users: { currentRoom.roomMembers }</p>
                    <p>kicked users: { currentRoom.kickedUsers }</p>
                    <p>baned users: { currentRoom.bannedUsers }</p>
                    <p>muted users: { currentRoom.mutedUsers }</p>
                </div>
            </div>
            <span onClick={onClose}><FontAwesomeIcon icon={faCircleXmark} /></span>
        </div>
    );
};
