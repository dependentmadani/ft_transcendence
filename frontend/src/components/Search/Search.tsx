import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { CreateRoom } from "../Rooms/CreateRoom";
import { useEffect, useState } from "react";
import axios from "axios";
import { SearchResult } from "./SearchResult";

interface User {}

export const Search = () => {
  const [username, setUsername] = useState('')
  const [searchResults, setSearchResults] = useState<User | null>([])
  
  // useEffect(() => {
  //   if (username.trim() !== '') {
  //     setUsername(username)
  //   }
  // })
    
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

  useEffect(() => {
    if (username.trim() !== '')
      getResults()
  }, [username])

  const [showForm, setShowForm] = useState(false);
  
  const openForm = () => {
    setShowForm(true);
  };
  
  const closeForm = () => {
    setShowForm(false);
  };
  
  console.log('username ', username, 'resluts ', searchResults)
  return (
    <div className="search">
      <span>
        <input type="text" placeholder="Find a user" onChange={e => setUsername(e.target.value)} />
        <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} onClick={openForm} />
        <CreateRoom />
      </span>
      { showForm && searchResults && <SearchResult onClose={closeForm} searchResults={searchResults} />}
    </div>
  )
}
