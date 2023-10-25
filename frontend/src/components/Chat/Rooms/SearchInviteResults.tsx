import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface User {
    id: number,
}

export const SearchInviteResults = ({ chatData, searchResults }: any) => {

    const currentRoom = chatData?._chat?.chat

    const sendInvite = async (invitedUser: User) => {
        // console.log('joinina assi ', invitedUser.id, currentRoom.id)

        // try {
            //     const response = await axios.post(`http://localhost:8000/invitations`, {
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
        const allow = (currentRoom.roomType === 'Private') ? false : true
        try {
            const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
            const res = await axios.post(`http://localhost:8000/roomUsers`, {
                roomId: currentRoom.id,
                userId: invitedUser.id,
                role: 'MEMBER',
                allowed: allow,
            },
            {
                withCredentials: true,
            });
            console.log('malja', _MAIN_USER_)
            // chatData?._socket?.emit('roomMembers', invitedUser)
            // chatData?._socket?.emit('createRoom', chatData?._chat?.chat, _MAIN_USER_.id)
            chatData?._socket?.emit('createRoom', {room: currentRoom, owner: invitedUser.id})
            console.log('rah mzyaaan', res)
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
