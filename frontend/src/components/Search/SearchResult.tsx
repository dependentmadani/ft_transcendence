import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useEffect } from 'react';

interface User {
    id: number,
    username: string,
    usrChatId: number,
}
interface Chat {
    chatId: number,
}

export const SearchResult = ({ onClose, searchResults, selectedChat }: any) => {

    const createChat = async (user: User) => {

        // check if we find a commun chatId between the current user and this user
        const sender = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
        const receiver = user.id
        if (sender.id !== receiver) {
            const communChats = await (await axios.get(`http://localhost:8000/chat/${sender.id}/${receiver}`, {withCredentials: true})).data
            // console.log('LA7BASS ', sender.id, receiver, communChats)
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
                console.log('YPOOOOOOO', chat.data, selectedChat)
            }
        }
    }
    
    // useEffect(() => {
    //   }, [selectedChat]);

    // console.log('HAANA 3', selectedChat)

    return (
        <div className="searchChatResults">
            <div className="searchChatResults-container">
                { searchResults.length ? 
                    searchResults.map((user: any, index: number) => (
                    <div key={index} className="userChats" onClick={() => createChat(user)} >
                        <img src={ user.avatar } alt="user_avatar" />
                        <div className="userChatInfo">
                            <span>{ user.username }</span>
                        </div>
                    </div>
                )) : 'Ghayarha a sadi9'
                }
            </div>
            <span onClick={onClose}><FontAwesomeIcon icon={faCircleXmark} /></span>
        </div>
    );
};
