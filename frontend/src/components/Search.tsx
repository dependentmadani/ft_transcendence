import { useState } from "react"

export const Search = () => {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState('')
  const [err, setErr] = useState('')

  // const handleKey = () => {
  //   const q = query(collection)
  // }
  return (
    <div className="search">
        <div className="searchForm">
            <input type="text" placeholder="Find a user" /*onKeyDown={handleKey}*/ onChange={e => setUsername(e.target.value)} />
        </div>
        {/* <div className="userChat">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV73Nl_MHzYV13X62NIRC8IX6FT6fenPinqCSSOS0HTQ&s" alt="" />
            <div className="userChatInfo">
                <span>Hmouda</span>
            </div>
        </div> */}
    </div>
  )
}
