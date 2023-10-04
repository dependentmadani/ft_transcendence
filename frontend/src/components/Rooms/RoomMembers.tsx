import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUser, faBellSlash, faBan, faUserLargeSlash, faUserLarge, faBell, faUserTie } from '@fortawesome/free-solid-svg-icons';
import io, { Socket } from 'socket.io-client';

interface User {
    id: number,
    username: string,
    role: string,
}

// interface Users {
//     id: number,
//     username: string,
//     role: string,
// }

interface RoomUsers {
    roomId: number,
    userId: number,
    role: string
}

export const RoomMembers = ({ currentRoom }: any) => {

    const [roomMembers, setRoomMembers] = useState<User[]>([])
    const [members, setMembers] = useState<User[]>([])
    const [mainUser, setMainUser] = useState<any>()
    const [socket, setSocket] = useState<Socket>()


    useEffect(() => {
        setMembers(roomMembers)
    }, [roomMembers])

    useEffect(() => {
        const _socket = io(`http://localhost:8000/chat`);
        setSocket(_socket)
    }, [setSocket]);

    const messageListener = (user: User) => {
        setMembers([...members, user])
        console.log('wow', user)
    }

    useEffect(() => {
        console.log('wow wow')
        socket?.on('roomMembers', messageListener)

        return () => {
        socket?.off('roomMembers', messageListener)
        }
    }, [messageListener])

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
                            const res = await axios.get(`http://localhost:8000/roomUsers/role/${currentRoom.id}/${membersIds[i]}`, { withCredentials: true })
                            members.push({'id': user?.data?.id, 'username': user?.data?.username, 'role': res?.data[0]?.role})
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

    console.log('Room members', roomMembers)


    useEffect(() => {
        const getMainUser = async () => {
            try {
                const _MAIN_USER_ = await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})
                setMainUser(_MAIN_USER_.data)
            }
            catch (err) {
                console.log(err)
            }
        }

        getMainUser()
    })

    const kickMember = async (user: User) => {
        try {
            const response = await axios.delete(`http://localhost:8000/roomUsers/${currentRoom.id}/${user.data.id}`, {
                withCredentials: true,
            });
            console.log(user.username , 'Kicked', response)
                
        } catch (error) {
            console.log(error);
        }
    }

    const muteBanMember = async (user: User, role: string) => {
        console.log('YooPlaaaaaaaaaaa')
        try {
            const response = await axios.patch(`http://localhost:8000/roomUsers/${currentRoom.id}/${user.data.id}`, {
                'role': role,
            }, {
                withCredentials: true,
            });
            console.log(role, response)
                
        } catch (error) {
            console.log(error);
        }
    }

    const unMuteBanMember = async (user: User, role: string) => {
        try {
            const response = await axios.patch(`http://localhost:8000/roomUsers/${currentRoom.id}/${user.data.id}`, {
                'role': role,
            }, {
                withCredentials: true,
            });
            console.log(role, response)
                
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        const oneUserRoomCase = async () => {
            const response = await axios.get(`http://localhost:8000/roomUsers/room/${currentRoom.id}`, {withCredentials: true})
            if (response.data.role !== 'OWNER' && response.data.length === 1) {
                const res = await axios.patch(`http://localhost:8000/roomUsers/${currentRoom.id}/${response?.data[0]?.userId}`, {
                    'role': 'ADMIN',
                }, {
                    withCredentials: true,
                });
                console.log(res)
            }
        }

        oneUserRoomCase()
    }, [currentRoom])


    return (
        <div className='roomMembers'>
            <p>Members</p>
            {
                members?.map((user: User, index: number) => (
                    <div key={index} className="roomMemberItem">
                        <span key={index} className='roomMember' >{ user.username }</span>
                            <span className='admin'>{ user.role === 'OWNER' && <FontAwesomeIcon className='roleIcon' icon={faBriefcase} /> }</span>
                            {
                                user.id !== mainUser?.id && user.role !== 'OWNER' && <div className="memberActions">
                                    { (user.role === 'MUTED') ? <FontAwesomeIcon icon={faBell} className='muteMemberIcon' onClick={() => unMuteBanMember(user, 'MEMBER')} /> : <FontAwesomeIcon icon={faBellSlash} className='muteMemberIcon' onClick={() => muteBanMember(user, 'MUTED')} /> }
                                    { (user.role === 'BANNED') ? <FontAwesomeIcon icon={faUserLarge} className='banMemberIcon' onClick={() => unMuteBanMember(user, 'MEMBER')} /> : <FontAwesomeIcon icon={faUserLargeSlash} className='banMemberIcon' onClick={() => muteBanMember(user, 'BANNED')} /> }
                                    { (user.role === 'ADMIN') ? <FontAwesomeIcon icon={faUser} className='muteMemberIcon' onClick={() => unMuteBanMember(user, 'MEMBER')} /> : <FontAwesomeIcon icon={faUserTie} className='muteMemberIcon' onClick={() => muteBanMember(user, 'OWNER')} /> }
                                    <FontAwesomeIcon icon={faBan} className='kickMemberIcon' onClick={() => kickMember(user)} />
                                </div>
                            }
                    </div>
                ))
            }
        </div>
    );
};
