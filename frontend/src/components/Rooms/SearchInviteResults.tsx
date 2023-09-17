import  { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface User {
    id: number,
}

export const SearchInviteResults = ({ currentRoom, searchResults }: any) => {

    // const [invitedUser, setInvitedUser] = useState<User | null>(null)

    const sendInvite = async (invitedUser: User) => {
        console.log('joinina assi ', invitedUser, currentRoom)

        try {
            const response = await axios.post(`http://localhost:8000/invitations`, {
                sender: 1, // for now
                receiver: invitedUser.id,
                roomId: currentRoom.id,
            });

            console.log('rah mzyaaan', response.data)
            // if (response.data) {
            // }
        } catch (error) {
            console.error(error);
        }
        // try {
        //     const response = await axios.post(`http://localhost:8000/roomUsers`, {
        //         roomId: roomId,
        //         userId: userId,
        //         role: 'MEMBER',
        //     });

        //     console.log('rah mzyaaan', roomId, userId)
        //     // if (response.data) {
        //     // }
        // } catch (error) {
        //     console.error(error);
        // }
    }

    
    return (
        <div className="searchInviteResults">
            <div className="searchInviteResult">
                {
                    searchResults.map((user: any, index: number) => (
                        <div className='inviteResults' key={index}>
                            <span>{ user.username }</span>
                            <FontAwesomeIcon className="inviteIcon" icon={faUserPlus} onClick={() => sendInvite(user)} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
};
