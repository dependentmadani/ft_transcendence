import axios from 'axios';
import { useEffect, useRef } from 'react';

interface User {
    id: number,
    username: string,
    usrChatId: number,
}


export const SearchResult = ({ onClose, searchResults, selectedChat }: any) => {

    const searchResultsRef = useRef<HTMLDivElement>(null);


    const createChat = async (user: User) => {
        
        // check if we find a commun chatId between the current user and this user
        const sender = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
        const receiver = user.id
        if (sender.id !== receiver) {
            const communChats = await (await axios.get(`http://localhost:8000/chat/${sender.id}/${receiver}`, {withCredentials: true})).data
            if (communChats.length === 0) {
                try {
                    const chat = await axios.post(`http://localhost:8000/chat`, {
                        senId: sender.id,
                        recId: receiver,
                    }, {
                        withCredentials: true
                    })
                    console.log('chat created ', chat)
                    selectedChat(chat);
                }
                catch (err) {
                    console.log(`Couldn't create new Chat: `, err)
                }
            }
            else {
                const chatRelation = await axios.get(`http://localhost:8000/chat/${sender.id}/${receiver}`, {withCredentials: true})
                const chat = await axios.get(`http://localhost:8000/chat/id/${chatRelation?.data[0]?.chatId}`, {withCredentials: true})
                selectedChat(chat.data)
            }
        }
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
                    <img src={ user.avatar } alt="user_avatar" />
                    <span>{ user.username }</span>
                </div>
            )) : 'No Results :('
            }
        </div>
    );
};
