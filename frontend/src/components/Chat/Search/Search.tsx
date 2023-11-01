import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { CreateRoom } from "../Rooms/CreateRoom";
import { useEffect, useState } from "react";
import axios from "axios";
import { SearchResult } from "./SearchResult";

interface User {}

export const Search = ({ onValueChange, chatData }: any) => {
  const [username, setUsername] = useState('')
  const [searchResults, setSearchResults] = useState<User | null>([])
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    if (username.trim() !== '') {
      const getResults = async () => {
        try {
          const results = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/search/${username}`, {withCredentials: true})
          setSearchResults(results.data)
        }
        catch {
          setSearchResults(null)
          console.error(`Couldn't find any user`)
        }
      }
      
      getResults()
    }
  }, [username])


  const openForm = () => {
    setShowForm(true);
  };
  
  const closeForm = () => {
    setUsername('')
    setSearchResults(null)
    setShowForm(false);
  };


  return (
    <div className="search">
      <div className="searchContainer">
        <div className="serchChatInput">
          <input type="text" className="search-chat-input" placeholder="Find a user" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="searchChatIcon">
          <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} onClick={openForm} />
        </div>
        <div className="searchChatCreatRoomIcon">
          <CreateRoom chatData={ chatData } />
        </div>
      </div>
      { showForm && searchResults && <SearchResult onClose={closeForm} onValueChange={onValueChange} searchResults={searchResults} />}
    </div>
  )
}
