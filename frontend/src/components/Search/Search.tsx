import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { CreateRoom } from "../Rooms/CreateRoom";
import { useEffect, useState } from "react";
import axios from "axios";
import { SearchResult } from "./SearchResult";

interface User {}

export const Search = ({ selectedChat }: any) => {
  const [username, setUsername] = useState('')
  const [searchResults, setSearchResults] = useState<User | null>([])
    
  
  useEffect(() => {
    if (username.trim() !== '') {
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
      
      // setUsername('')
      getResults()
    }
  }, [username])

  const [showForm, setShowForm] = useState(false);
  
  const openForm = () => {
    setShowForm(true);
  };
  
  const closeForm = () => {
    setUsername('')
    setSearchResults(null)
    // console.log('YOOO', username)
    setShowForm(false);
  };

  // console.log('HAANA 2', selectedChat)

  return (
    <div className="search">
      <div className="searchContainer">
        <div className="serchChatInput">
          <input type="text" placeholder="Find a user" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="searchChatIcon">
          <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} onClick={openForm} />
        </div>
        <div className="searchChatCreatRoomIcon">
          <CreateRoom />
        </div>
      </div>
      { showForm && searchResults && <SearchResult onClose={closeForm} selectedChat={selectedChat} searchResults={searchResults} />}
    </div>
  )
}
