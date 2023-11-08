import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUser, faBellSlash, faBan, faUserLargeSlash, faUserLarge, faBell, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { useRightBar } from '@/context/RightBarContext';



export const RoomMembers = ({ chatData }: any) => {

    const currentRoom: Contact = chatData?._chat
    const [roomMembers, setRoomMembers] = useState<any[]>([])
    const [mainUesrRole, setMainUserRole] = useState()


    const addMemberListener = (user: any) => {
        console.log('mal mok', user)
        if (roomMembers.find(u => u.userId === user.userId) === undefined)
            setRoomMembers([...roomMembers, user])
    }

    useEffect(() => {
        chatData?._socket?.on('addMember', addMemberListener)

        return () => {
            chatData?._socket?.off('addMember')
        }
    }, [chatData._socket, addMemberListener])

    const removeMemberListener = (user: any) => {
        if (roomMembers.find(u => u.userId === user.userId) !== undefined)
            setRoomMembers(prevMembers => prevMembers.filter(member => member.userId !== user.userId))
    }

    const updateMemberRole = async () => {
        setRoomMembers((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/Room/${currentRoom.id}`, {withCredentials: true})).data)
        setMainUserRole((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/role/${currentRoom.id}/${chatData._mainUser.id}`, {withCredentials: true})).data)
    }

    useEffect(() => {
        chatData?._socket?.on('removeMembers', removeMemberListener)
        chatData?._socket?.on('updateRole', updateMemberRole)

        return () => {
            chatData?._socket?.off('removeMembers')
        }
    }, [chatData._socket, removeMemberListener])


    useEffect(() => {
        const getRoomMembers = async () => {
            try {
                setRoomMembers((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/Room/${currentRoom.id}`, {withCredentials: true})).data)
                setMainUserRole((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/role/${currentRoom.id}/${chatData._mainUser.id}`, {withCredentials: true})).data)
            }
            catch (err) {
                console.log('Something went wrong :<', err)
            }
        }
        
        getRoomMembers()
    }, [])


    const kickMember = async (user: any) => {
        try {
            await axios.delete(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/${currentRoom.id}/${user.userId}`, { withCredentials: true, });
            chatData?._socket?.emit('leaveRoom', {roomId: currentRoom.id, owner: user.userId})


            const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/Room/${currentRoom.id}`, {withCredentials: true})
            if (res.data.length === 1 && res.data[0].role !== 'OWNER' && res.data[0].role !== 'ADMIN') {
                await axios.patch(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/${currentRoom.id}/${res?.data[0]?.userId}`, {
                    'role': 'ADMIN',
                }, {
                    withCredentials: true,
                });
            }

            chatData?._socket?.emit('removeRoomMembers', user)
            chatData?._socket?.emit('sortContacts')
            chatData?._socket?.emit('lockRoom')
                
        } catch (error) {
            console.log(error);
        }
    }

    const muteBanMember = async (user: any, role: string) => {
        try {
            await axios.patch(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/${currentRoom.id}/${user.userId}`, {
                'role': role,
            }, {
                withCredentials: true,
            });
            chatData?._socket?.emit('updateMemberRole', user)
            if (role === "MUTED") {
                chatData?._socket?.emit('lockRoom')
            }
        } catch (error) {
            console.log(error);
        }
    }

    const unMuteBanMember = async (user: any, role: string) => {
        try {
            await axios.patch(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/${currentRoom.id}/${user.userId}`, {
                'role': role,
            }, {
                withCredentials: true,
            });
            chatData?._socket?.emit('updateMemberRole', user)
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <div className='roomMembers'>
            <p>Members</p>
            {
                roomMembers?.map((user: any, index: number) => (
                    <div key={index} className="roomMemberItem">
                        <span key={index} className='roomMember' >{ user.userUsername }</span>
                            {
                               (user.role === 'OWNER') &&
                                    
                                    <span className='admin'>
                                        {  user.role === 'OWNER' && <FontAwesomeIcon className='roleIcon' icon={faBriefcase} /> }
                                    </span>
                                    
                            }
                            {
                               (user.role === 'ADMIN' && mainUesrRole !== 'OWNER') &&
                                    
                                    <span className='admin'>
                                        {  user.role === 'OWNER' && <FontAwesomeIcon className='roleIcon' icon={faBriefcase} /> }
                                        {  user.role === 'ADMIN' && <FontAwesomeIcon className='roleIcon' style={{'color': 'gold'}} icon={faUserTie} /> }
                                    </span>
                                    
                            }
                            {
                                (mainUesrRole === 'OWNER' && user.role !== 'OWNER') &&
                                    
                                <div className="memberActions">
                                    { (user.role === 'MUTED') ? <FontAwesomeIcon icon={faBell} className='muteMemberIcon' onClick={() => unMuteBanMember(user, 'MEMBER')} /> : <FontAwesomeIcon icon={faBellSlash} className='muteMemberIcon' onClick={() => muteBanMember(user, 'MUTED')} /> }
                                    {/* { (user.role === 'BANNED') ? <FontAwesomeIcon icon={faUserLarge} className='banMemberIcon' onClick={() => unMuteBanMember(user, 'MEMBER')} /> : <FontAwesomeIcon icon={faUserLargeSlash} className='banMemberIcon' onClick={() => muteBanMember(user, 'BANNED')} /> } */}
                                    { (user.role === 'ADMIN') ? <FontAwesomeIcon icon={faUser} className='muteMemberIcon' onClick={() => unMuteBanMember(user, 'MEMBER')} /> : <FontAwesomeIcon icon={faUserTie} className='muteMemberIcon' onClick={() => muteBanMember(user, 'ADMIN')} /> }
                                    <FontAwesomeIcon icon={faBan} className='kickMemberIcon' onClick={() => kickMember(user)} />
                                </div>
                            }
                            {
                                (mainUesrRole === 'ADMIN' && user.role !== 'OWNER' && user.role !== 'ADMIN') &&
                                    
                                <div className="memberActions">
                                    { (user.role === 'MUTED') ? <FontAwesomeIcon icon={faBell} className='muteMemberIcon' onClick={() => unMuteBanMember(user, 'MEMBER')} /> : <FontAwesomeIcon icon={faBellSlash} className='muteMemberIcon' onClick={() => muteBanMember(user, 'MUTED')} /> }
                                    {/* { (user.role === 'BANNED') ? <FontAwesomeIcon icon={faUserLarge} className='banMemberIcon' onClick={() => unMuteBanMember(user, 'MEMBER')} /> : <FontAwesomeIcon icon={faUserLargeSlash} className='banMemberIcon' onClick={() => muteBanMember(user, 'BANNED')} /> } */}
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