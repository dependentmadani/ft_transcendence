import  { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faPaperPlane, faImage, faUserPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface User {}

export const SearchInviteResults = ({ searchResults }: any) => {

    // const [invitedUser, setInvitedUser] = useState<User | null>(null)

    const sendInvite = (invitedUser: User) => {
        console.log('joinina assi ', invitedUser.username)
    }

    
    return (
        <div className="searchInviteResults">
            <div className="searchInviteResult">
                {
                    searchResults.map((user: any, index: number) => (
                        <div className='inviteResults' key={index}>
                                <span>{user.username }</span>
                                <FontAwesomeIcon className="inviteIcon" icon={faUserPlus} onClick={() => sendInvite(user)} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
};
