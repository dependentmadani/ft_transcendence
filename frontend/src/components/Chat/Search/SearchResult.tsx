import { useShow } from '@/context/ShowFormContext';
import axios from 'axios';
import { useEffect, useRef } from 'react';



export const SearchResult = ({ onClose, searchResults, onValueChange, chatData }: any) => {

    const searchResultsRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useShow();


    const createChat = async (user: User) => {
        
        let chat = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/one-contact/${chatData._mainUser.id}/${user.id}`, {withCredentials: true})).data
        
        console.log('data', chatData,' | ', user, " | ", chat)
        if (!chat) {
            try {
                chat = (await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/chat`, {
                    senId: chatData._mainUser.id,
                    recId: user.id,
                }, { withCredentials: true })).data
            }
            catch (err) {
                console.log(`Couldn't create new Chat: `, err)
            }
        }

        onValueChange(chat)
        setShow('true');
    }


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);
  

    return (
        <div className="searchChatResults" ref={searchResultsRef}>
            { searchResults.length ? 
                searchResults.map((user: any, index: number) => (
                <div key={index} className="searchResInfo" onClick={() => createChat(user)} >
                    <img src={ user.avatar } className='result-img' alt="user_avatar" />
                    <span>{ user.username }</span>
                </div>
            )) : 'No Results :('
            }
        </div>
    );
};
