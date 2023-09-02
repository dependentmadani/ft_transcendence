import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface User {
    id: number,
    username: string,
    usrChatId: number,
}

export const SearchResult = ({ onClose, searchResults }: any) => {

    console.log('wazawizzz ', typeof(searchResults))

    const createChat = async (user: User) => {
        // check if we find a commun chatId between the current user and this user
        const currentUserId = [1,2,3]
        const userChatId = [19,28,37]
        console.log('Commun id -> ', userChatId.some(e => currentUserId.includes(e)))
        if (!userChatId.some(e => currentUserId.includes(e)))
        {
            // create chat
            try {
                return await axios.post('http://localhost:8000/chat', {
                    senId: 1,
                    recId: 2,
                    usrChatId: 1,
                })
            }
            catch
            {
              console.log(`Couldn't create new Chat`)
            }

        }
        // open chat
    }

    return (
        <div className="search-overlay">
            <div className="search-pop-container">
                <div className="chats">
                    { searchResults.length ? 
                        searchResults.map((user: any, index: number) => (
                        <div key={index} className="userChats" onClick={() => createChat(user)} >
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV73Nl_MHzYV13X62NIRC8IX6FT6fenPinqCSSOS0HTQ&s" alt="" />
                            <div className="userChatInfo">
                                <span>{user.username }</span>
                            </div>
                        </div>
                    )) : 'Ghayarha a sadi9'
                    }
                </div>
            </div>
            <span onClick={onClose}><FontAwesomeIcon icon={faCircleXmark} /></span>
        </div>
    );
};
