import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUser } from '@fortawesome/free-solid-svg-icons';

interface User {
    data: {
        username: string,
    },
    role: string,
}

interface RoomUsers {
    roomId: number,
    userId: number,
    role: string
}

export const RoomMembers = ({ currentRoom }: any) => {

    const [roomMembers, setRoomMembers] = useState<User[] | null>([])

    useEffect(() =>{
        const getRoomMembers = async () => {
            try {
                const result = await axios.get(`http://localhost:8000/roomUsers/room/${currentRoom.id}`, {withCredentials: true})
                if (result.data) {
                    let membersIds: number[] = []
                    result.data.map((member: RoomUsers) => (
                        membersIds.push(member?.userId)
                    ))
                    let members: any = []
                    for (let i=0; i<membersIds.length; i++) {
                        try {
                            const user = await axios.get(`http://localhost:8000/users/${membersIds[i]}`, {withCredentials: true})
                            const result1 = await axios.get(`http://localhost:8000/roomUsers/owner/${currentRoom.id}`, {withCredentials: true})
                            const result2 = await axios.get(`http://localhost:8000/roomUsers/admins/${currentRoom.id}`, {withCredentials: true})
                            let role: string
                            if (result1.data)
                                role = 'owner'
                            else if (result2.data)
                                role = 'admin'
                            else
                                role = 'member'
                            members.push({'role': role, 'data': user.data})
                        }
                        catch (err) {
                            console.log(`Couldn't fetch any user`)
                        }
                    }
                    setRoomMembers(members)
                }
            }
            catch {
                console.log('No users for this room')
            }
        }
        getRoomMembers()
    }, [])

    // console.log('ROOM Members ', roomMembers)
    // console.log(currentRoom)

    return (
        <div className='roomMembers'>
            <p>Members</p>
            {
                roomMembers?.map((user: User, index: number) => (
                    <span key={index} className='roomMember' >{ user.data.username }
                        <span className='admin'>{ user.role === 'admin' && <FontAwesomeIcon className='roleIcon' icon={faUser} /> }</span>
                        <span className='owner'>{ user.role === 'owner' && <FontAwesomeIcon className='roleIcon' icon={faBriefcase} /> }</span>
                    </span>
                ))
            }
        </div>
    );
};
