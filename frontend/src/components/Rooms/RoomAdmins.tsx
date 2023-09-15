import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SearchInviteResults } from './SearchInviteResults';

interface User {
    username: string,
}

interface RoomUsers {
    roomId: number,
    userId: number,
    role: string
}

export const RoomAdmins = ({ currentRoom }: any) => {

    const [roomAdmins, setRoomAdmins] = useState<User[] | null>([])

    useEffect(() =>{
        const getRoomAdmins = async () => {
            try {
                const result = await axios.get(`http://localhost:8000/roomUsers/admins/${currentRoom.id}`)
                if (result.data) {
                    let adminsIds: number[] = []
                    result.data.map((member: RoomUsers) => (
                        adminsIds.push(member?.userId)
                    ))
                    let members: User[] = []
                    for (let i=0; i<adminsIds.length; i++) {
                        try {
                            const user = await axios.get(`http://localhost:8000/users/${adminsIds[i]}`)
                            members.push(user.data)
                        }
                        catch (err) {
                            console.error(`Couldn't fetch any user`)
                        }
                    }
                    setRoomAdmins(members)
                }
            }
            catch {
                console.error(`coudn't get admins of this room`)
            }
        }
        getRoomAdmins()
    }, [])

    console.log('ROOM ADMINS ', roomAdmins)
    console.log(currentRoom)

    return (
        <div>
            <p>Admins</p>
            {
                roomAdmins?.map((user: User) => (
                    <p>{ user.username }</p>
                ))
            }
        </div>
    );
};
