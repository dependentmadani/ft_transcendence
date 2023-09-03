import  { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faPaperPlane, faImage, faUserPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


export const SearchInviteResults = ({ searchResults }: any) => {

    const sendInvite = () => {
        console.log('send lo invite')
    }
    
    return (
        <div className="searchInviteResults">
            <div className="searchInviteResult">
                {
                    searchResults.map((user: any, index: number) => (
                        <div className='inviteResults' key={index}>
                                <span>{user.username }</span>
                                <FontAwesomeIcon className="inviteIcon" icon={faUserPlus} onClick={sendInvite} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
};
