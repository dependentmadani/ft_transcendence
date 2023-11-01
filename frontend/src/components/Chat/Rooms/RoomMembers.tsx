import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUser, faBellSlash, faBan, faUserLargeSlash, faUserLarge, faBell, faUserTie } from '@fortawesome/free-solid-svg-icons';



export const RoomMembers = ({ chatData }: any) => {

    const currentRoom: Contact = chatData?._chat
    const [roomMembers, setRoomMembers] = useState<any[]>([])
    const [mainUesrRole, setMainUserRole] = useState()


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
                setRoomMembers((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/Room/${currentRoom.id}`, {withCredentials: true})).data)
                setMainUserRole((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/role/${chatData._mainUser.id}/${currentRoom.id}`, {withCredentials: true})).data)
            }
            catch (err) {
                console.log('Something went wrong :<', err)
            }
        }
        
        getRoomMembers()
    }, [])


    const kickMember = async (user: User) => {
        try {
            await axios.delete(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/${currentRoom.id}/${user.id}`, { withCredentials: true, });
            chatData?._socket?.emit('leaveRoom', {roomId: currentRoom.id, owner: user.id})


            const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/Room/${currentRoom.id}`, {withCredentials: true})
            if (res.data.length === 1 && res.data[0].role !== 'OWNER' && res.data[0].role !== 'ADMIN') {
                await axios.patch(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/${currentRoom.id}/${res?.data[0]?.userId}`, {
                    'role': 'ADMIN',
                }, {
                    withCredentials: true,
                });
            }
                
        } catch (error) {
            console.log(error);
        }
    }

    const muteBanMember = async (user: User, role: string) => {
        try {
            await axios.patch(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/${currentRoom.id}/${user.id}`, {
                'role': role,
            }, {
                withCredentials: true,
            });
                
        } catch (error) {
            console.log(error);
        }
    }

    const unMuteBanMember = async (user: User, role: string) => {
        try {
            await axios.patch(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/${currentRoom.id}/${user.id}`, {
                'role': role,
            }, {
                withCredentials: true,
            });
                
        } catch (error) {
            console.log(error);
        }
    }



    console.log('Members: ', roomMembers)

    return (
        <div className='roomMembers'>
            <p>Members</p>
            {
                roomMembers?.map((user: any, index: number) => (
                    <div key={index} className="roomMemberItem">
                        <span key={index} className='roomMember' >{ user.userUsername }</span>
                            {
                               (user.role === 'OWNER' || (user.role === 'ADMIN')) &&
                                    
                                    <span className='admin'>
                                        {  user.role === 'OWNER' && <FontAwesomeIcon className='roleIcon' icon={faBriefcase} /> }
                                        {  user.role === 'ADMIN' && <FontAwesomeIcon className='roleIcon' style={{'color': 'gold'}} icon={faUserTie} /> }
                                    </span>
                                    
                            }
                            {
                                (mainUesrRole === 'OWNER' && user.role !== 'OWNER' && user.role !== 'ADMIN') &&
                                    
                                <div className="memberActions">
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
