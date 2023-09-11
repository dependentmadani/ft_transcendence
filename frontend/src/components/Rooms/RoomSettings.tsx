import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import axios from 'axios';
import { SearchInviteResults } from './SearchInviteResults';

interface User {}

export const RoomSettings = ({ onClose, currentRoom }: any) => {

    const [searchResults, setSearchResults] = useState<User | null>([])
    const [username, setUsername] = useState('')
    
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
                <p>{ currentRoom.roomName }</p>
                <div className="roomFormInvite">
                        <div className="searchInvite">
                            <input type="text" placeholder="Invite a user" onChange={e => setUsername(e.target.value)} />
                            <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} onClick={ getResults } />
                        </div>
                        { searchResults && <SearchInviteResults searchResults={searchResults} /> }
                </div>
                <div className="mutualContact flex-item">
                    <p>members</p>
                    <p>room admin: { currentRoom.roomMembers }</p>
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
