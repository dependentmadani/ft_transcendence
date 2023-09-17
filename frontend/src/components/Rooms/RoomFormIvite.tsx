import  { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { SearchInviteResults } from './SearchInviteResults';

interface User {}
// interface Room {}

export const RoomFormInvite = ({ currentRoom }: any) => {

    const [searchResults, setSearchResults] = useState<User | null>([])
    const [username, setUsername] = useState('')

    useEffect(() => {
        getResults()
    }, [username])
    

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
        <div className="roomFormInvite">
                <div className="searchInvite">
                    <input type="text" placeholder="Invite a user" onChange={e => setUsername(e.target.value)} />
                    <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} onClick={ getResults } />
                </div>
                { searchResults && <SearchInviteResults currentRoom={currentRoom} searchResults={searchResults} /> }
        </div>
    );
};
