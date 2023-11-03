import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// interface User {
//     id: number,
// }

export const SearchInviteResults = ({ chatData, searchResults }: any) => {

    const currentRoom = chatData?._chat

    const sendInvite = async (invitedUser: User) => {
        // console.log('joinina assi ', invitedUser.id, currentRoom.id)

        // try {
            //     const response = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/invitations`, {
                //         sender: _MAIN_USER_.id,
                //         receiver: invitedUser.id,
                //         roomId: currentRoom.id,
                //     }, {
                    //         withCredentials: true,
                    //     });
                    
                    //     console.log('rah mzyaaan', response.data)
                    // }
                    // catch (error) {
                        //     console.log(error);
                        // }
                        // console.log('data to room', currentRoom, invitedUser)
                        
        const allow = (currentRoom.protection === 'Protected') ? false : true
        try {
            await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers`, {
                roomId: currentRoom.id,
                userId: invitedUser.id,
                userUsername: invitedUser.username,
                role: 'MEMBER',
                allowed: allow,
            },
            {
                withCredentials: true,
            });
            chatData?._socket?.emit('roomMembers', invitedUser.id)
            chatData?._socket?.emit('createRoom', {room: currentRoom, owner: invitedUser.id})
            chatData?._socket?.emit('sortContacts')
        }
        catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="searchInviteResults">
            {
                searchResults.map((user: any, index: number) => (
                    <div className='inviteResults' key={index}>
                        <span className='resultName'>{ user.username }</span>
                        <FontAwesomeIcon className="inviteIcon" icon={faUserPlus} onClick={() => sendInvite(user)} />
                    </div>
                ))
            }
        </div>
    );
};
