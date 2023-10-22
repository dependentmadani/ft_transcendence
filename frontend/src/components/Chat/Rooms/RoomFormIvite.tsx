import  { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { SearchInviteResults } from './SearchInviteResults';

interface User {}

export const RoomFormInvite = ({ chatData }: any) => {

    const [searchResults, setSearchResults] = useState<User | null>([])
    const [username, setUsername] = useState('')


    useEffect(() => {
        getResults()
    }, [username])
    
    const getResults = async () => {
        if (username) {
            try {
                const results = await axios.get(`http://localhost:8000/users/search/${username}`, {withCredentials: true})
                setSearchResults(results.data)
            }
            catch (err) {
                setSearchResults(null)
            }
            setUsername('')
        }
    }


    return (
        <div className="roomFormInvite">
            <div className="searchInvite">
                <input type="text" placeholder="Invite a user" onChange={e => setUsername(e.target.value)} />
                <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} onClick={ getResults } />
            </div>
            { searchResults && <SearchInviteResults chatData={chatData} searchResults={searchResults} /> }
        </div>
    );
};
