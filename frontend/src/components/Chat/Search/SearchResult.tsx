import axios from 'axios';
import { useEffect, useRef } from 'react';

interface User {
    id: number,
    username: string,
    usrChatId: number,
}

interface Chat {
    chatId: number,
    chatUsers: number[],
    sender: User,
    receiver: User,
    latestMessageDate: Date,
    latestMessageContent: string,
    type: string,
}

export const SearchResult = ({ onClose, searchResults, chatData, onValueChange }: any) => {

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
                    // selectedChat(chat);
                    const type='chat'
                    onValueChange({chat, type})
                }
                catch (err) {
                    console.log(`Couldn't create new Chat: `, err)
                }
            }
            else {
                // const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
                const chatRelation = await axios.get(`http://localhost:8000/chat/${sender.id}/${receiver}`, {withCredentials: true})
                const _chat = (await axios.get(`http://localhost:8000/chat/id/${chatRelation?.data[0]?.chatId}`, {withCredentials: true})).data
                // selectedChat(chat.data)

                // const sender = chat.chatUsers[0] === _MAIN_USER_.id ? chat.chatUsers[0] : chat.chatUsers[1];
                // const receiver = chat.chatUsers[0] === _MAIN_USER_.id ? chat.chatUsers[1] : chat.chatUsers[0];
                const senderResponse = await axios.get(`http://localhost:8000/users/${sender.id}`, {withCredentials: true});
                const receiverResponse = await axios.get(`http://localhost:8000/users/${receiver}`, {withCredentials: true});
                const _latestMessage = (await axios.get(`http://localhost:8000/message/chat/${_chat?.chatId}`, {withCredentials: true}))?.data;
                const latestMessageDate = _latestMessage[_latestMessage.length - 1]?.createdAt || null;
                const latestMessageContent = _latestMessage[_latestMessage.length - 1]?.textContent || null;
                

                const chat: Chat = {
                    chatId: _chat.chatId,
                    chatUsers: [sender, receiver],
                    sender: senderResponse.data,
                    receiver: receiverResponse.data,
                    latestMessageDate: latestMessageDate,
                    latestMessageContent: latestMessageContent,
                    type: 'chat',
                };
                const type='chat'
                onValueChange({chat, type})
                console.log('search chat', chat)
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
                    <img src={ user.avatar } className='result-img' alt="user_avatar" />
                    <span>{ user.username }</span>
                </div>
            )) : 'No Results :('
            }
        </div>
    );
};
