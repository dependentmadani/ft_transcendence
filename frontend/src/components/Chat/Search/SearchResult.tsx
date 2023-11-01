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

export const SearchResult = ({ onClose, searchResults, onValueChange }: any) => {

    const searchResultsRef = useRef<HTMLDivElement>(null);


    const createChat = async (user: User) => {
        
        // check if we find a commun chatId between the current user and this user
        const sender = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
        const receiver = user.id
        if (sender.id !== receiver) {
            const communChats = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/chat/${sender.id}/${receiver}`, {withCredentials: true})).data
            if (communChats.length === 0) {
                try {
                    const chat = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/chat`, {
                        senId: sender.id,
                        recId: receiver,
                    }, {
                        withCredentials: true
                    })
                    const type='chat'
                    onValueChange({chat, type})
                }
                catch (err) {
                    console.log(`Couldn't create new Chat: `, err)
                }
            }
            else {
                const chatRelation = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/chat/${sender.id}/${receiver}`, {withCredentials: true})
                const _chat = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/chat/id/${chatRelation?.data[0]?.chatId}`, {withCredentials: true})).data

                const senderResponse = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/${sender.id}`, {withCredentials: true});
                const receiverResponse = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/${receiver}`, {withCredentials: true});
                const _latestMessage = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/message/chat/${_chat?.chatId}`, {withCredentials: true}))?.data;
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
