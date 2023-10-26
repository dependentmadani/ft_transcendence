import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUser, faBellSlash, faBan, faUserLargeSlash, faUserLarge, faBell, faUserTie } from '@fortawesome/free-solid-svg-icons';

interface User {
    id: number,
    username: string,
    role: string,
}

interface RoomUsers {
    roomId: number,
    userId: number,
    role: string,
}

export const RoomMembers = ({ chatData }: any) => {

    const currentRoom = chatData?._chat?.chat
    const [roomMembers, setRoomMembers] = useState<User[]>([])
    const [mainUser, setMainUser] = useState<any>()


    const addMemberListener = (user: User) => {
        if (roomMembers.find(u => u.id === user.id) === undefined)
            setRoomMembers([...roomMembers, user])
    }

    useEffect(() => {
        chatData?._socket?.on('members', addMemberListener)

        return () => {
            chatData?._socket?.off('members')
        }
    }, [addMemberListener])

    const removeMemberListener = (user: User) => {
        if (roomMembers.find(u => u.id === user.id) !== undefined)
            setRoomMembers(prevMembers => prevMembers.filter(member => member.id !== user.id))
    }

    useEffect(() => {
        chatData?._socket?.on('removeMembers', removeMemberListener)

        return () => {
            chatData?._socket?.off('removeMembers')
        }
    }, [removeMemberListener])


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
            catch (err) {
                console.log('No users for this room: ', err)
            }
        }
        
        getRoomMembers()
    }, [currentRoom])



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
            const response = await axios.delete(`http://localhost:8000/roomUsers/${currentRoom.id}/${user.id}`, { withCredentials: true, });
            // chatData?._socket?.emit('removeRoomMembers', user)
            // chatData?._socket?.emit('leaveRoom', chatData?._chat?.chat)
            chatData?._socket?.emit('leaveRoom', {roomId: currentRoom.id, owner: user.id})
            console.log(user.username , 'Kicked', response)


            // const _MAIN_USER_ = await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})
            const res = await axios.get(`http://localhost:8000/roomUsers/room/${currentRoom.id}`, {withCredentials: true})
            console.log('uuuuuserrrrr', res.data[0].role)
            if (res.data.length === 1 && res.data[0].role !== 'OWNER' && res.data[0].role !== 'ADMIN') {
                console.log('YOOOOOOOOO', user.role, res.data.length)
                const resp = await axios.patch(`http://localhost:8000/roomUsers/${currentRoom.id}/${res?.data[0]?.userId}`, {
                    'role': 'ADMIN',
                }, {
                    withCredentials: true,
                });
                console.log(resp)
            }
                
        } catch (error) {
            console.log(error);
        }
    }

    const muteBanMember = async (user: User, role: string) => {
        try {
            const response = await axios.patch(`http://localhost:8000/roomUsers/${currentRoom.id}/${user.id}`, {
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
            const response = await axios.patch(`http://localhost:8000/roomUsers/${currentRoom.id}/${user.id}`, {
                'role': role,
            }, {
                withCredentials: true,
            });
            console.log(role, response)
                
        } catch (error) {
            console.log(error);
        }
    }


    // useEffect(() => {
    //     const oneUserRoomCase = async () => {
    //         const _MAIN_USER_ = await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})
    //         const response = await axios.get(`http://localhost:8000/roomUsers/role/${currentRoom.id}/${_MAIN_USER_?.data?.id}`, {withCredentials: true})
    //         if (response.data.role !== 'OWNER' && response.data.length === 1) {
    //             console.log('YOOOOOOOOO', response.data, _MAIN_USER_)
    //             const res = await axios.patch(`http://localhost:8000/roomUsers/${currentRoom.id}/${response?.data[0]?.userId}`, {
    //                 'role': 'ADMIN',
    //             }, {
    //                 withCredentials: true,
    //             });
    //             console.log(res)
    //         }
    //     }

    //     oneUserRoomCase()
    // }, [currentRoom])

    // console.log('ALL USERS', roomMembers)

    return (
        <div className='roomMembers'>
            <p>Members</p>
            {
                roomMembers?.map((user: User, index: number) => (
                    <div key={index} className="roomMemberItem">
                        <span key={index} className='roomMember' >{ user.username }</span>
                            <span className='admin'>{ user.role === 'OWNER' && <FontAwesomeIcon className='roleIcon' icon={faBriefcase} /> }</span>
                            <span className='admin'>{ user.role === 'ADMIN' && <FontAwesomeIcon className='roleIcon' style={{'color': 'gold'}} icon={faUserTie} /> }</span>
                            {
                                user.id !== mainUser?.id && user.role !== 'OWNER' && user.role !== 'ADMIN' && <div className="memberActions">
                                    { (user.role === 'MUTED') ? <FontAwesomeIcon icon={faBell} className='muteMemberIcon' onClick={() => unMuteBanMember(user, 'MEMBER')} /> : <FontAwesomeIcon icon={faBellSlash} className='muteMemberIcon' onClick={() => muteBanMember(user, 'MUTED')} /> }
                                    { (user.role === 'BANNED') ? <FontAwesomeIcon icon={faUserLarge} className='banMemberIcon' onClick={() => unMuteBanMember(user, 'MEMBER')} /> : <FontAwesomeIcon icon={faUserLargeSlash} className='banMemberIcon' onClick={() => muteBanMember(user, 'BANNED')} /> }
                                    { (user.role === 'ADMIN') ? <FontAwesomeIcon icon={faUser} className='muteMemberIcon' onClick={() => unMuteBanMember(user, 'MEMBER')} /> : <FontAwesomeIcon icon={faUserTie} className='muteMemberIcon' onClick={() => muteBanMember(user, 'ADMIN')} /> }
                                    <FontAwesomeIcon icon={faBan} className='kickMemberIcon' onClick={() => kickMember(user)} />
                                </div>
                            }
                    </div>
                ))
            }
        </div>
    );
};
