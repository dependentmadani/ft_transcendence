import './navBarTwo.css'
import { Link, useNavigate } from "react-router-dom"
import  { useEffect, useState } from 'react';
import { useClient } from '@/context/clientContext';
import Client from '@/components/ClientClass/client';
import axios from 'axios';
import io, { Socket } from 'socket.io-client';
import { useSocket } from '@/context/socketContext';
import { useGame } from '@/context/GameContext';

interface Notifications {
    id: number,
    senderId: number,
    receiverId: number,
    title: string,
    read: boolean,
    type: string,
    description: string,
    mode: string,
}

interface Notifs {
    id: number,
    sender: any,
    receiver: any,
    status: boolean,
    avatar: string,
    type: string,
    content: string,
    mode: string,
}

interface User {
    id: number,
    username: string,
}

const ListNotification = () => {

    const [notifications, setNotifications] = useState<Notifications[]>([])
    const [newNotifications, setNewNotifications] = useState<Notifs[]>([])
    const [socket, setSocket] = useState<Socket>()
    const {socketa} = useSocket();
    const [_game, setGame] = useGame();
    const navigate = useNavigate();
    // useEffect(() => {

    //   const _socket: any = io(`http://${import.meta.env.VITE_BACK_ADDRESS}/notification`);
    //   setSocket(_socket)
      
    //   return () => {
    //     socket?.disconnect()
    //   }
    // }, []);

    
    
    

    useEffect(() => {
        const fetchNotifications = async () => {
          try {
            const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/notifications`, {withCredentials: true})
            setNotifications(res.data)
          }
          catch (err) {
            console.log('No Notifications')
          }
        }

        fetchNotifications()
    }, [])
    
    useEffect(() => {
        const getNotifications = async () => {
            try {
                const mainUser = await (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})).data
                const newNotificationsData = await Promise.all(
                    notifications.map(async (notification) => {
                    const senderResponse = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/${notification.senderId}`, {withCredentials: true});
                    const receiverResponse = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/${notification.receiverId}`, {withCredentials: true});
                    
                    const newNotif: Notifs = {
                        id: notification.id,
                        sender: senderResponse.data,
                        receiver: receiverResponse.data,
                        status: notification.read,
                        avatar: senderResponse?.data?.avatar,
                        type: notification.type,
                        content: senderResponse.data.username  + (notification.type === 'FRIEND' ? ' wants to connect with you' : ' wants to play with you'),
                        mode: notification.mode,
                    };

                    
                    
                    // Only My notifs and pendending status stay
                    // console.log('psps', newNotif.status, newNotif.receiver.id, mainUser.id)
                    if (newNotif.status === false && newNotif.receiver.id === mainUser.id)
                        return newNotif
                    return null
                })
                );
                const filteredNotificationsData: any = newNotificationsData.filter((notification) => notification !== null);
                setNewNotifications(filteredNotificationsData);
            }
            catch (err) {
              console.log('Error fetching users for chats: ', err);
            }
        }

        getNotifications()
    }, [notifications])


    // Handle friend request or Game invitaion function
    const handleAccept = async (notif: Notifs) => {
        
        if (notif.type === 'FRIEND') { // Handling friend request
            const res = await axios.put(`http://${import.meta.env.VITE_BACK_ADDRESS}/notifications/friendAcception`, {
                'senderId' : notif.sender.id,
                'receiverId': notif.receiver.id,
                'notifId': notif.id,
            }, {
                withCredentials: true
            })
            console.log('FRIENDIW LINA HADO', notif.sender.username, notif.receiver.username, res.data)
        }
        else if (notif.type === 'GAME') { // Handling Game invitaion
            socketa?.emit('notification', { notif: notif });
            console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%', notif)
            // Redirect Invitation receiver (res.data.receiverId) here

            //NAVIGATE INVITE GAME RECEEIVER;
            setGame({playerID1: notif.sender.id, playerID2: notif.receiver.id, mode: notif.mode})
            navigate('/game/invite');

        }

        // Updating state of notification
        // const r = await axios.put(`http://${import.meta.env.VITE_BACK_ADDRESS}/notifications/state/${notif.id}`, { withCredentials: true })

    }


    // Handle Refuse of friend request or Game invitation
    const handleRefuse = async (notif: Notifs) => {

        // Removing the notificaiton
        try {
            await axios.delete(`http://${import.meta.env.VITE_BACK_ADDRESS}/notifications/${notif.id}`,  { withCredentials: true })
        }
        catch (err) {
            console.log(`Coudn't delete notification: `, err)
        }
    }

    console.log('Notifs', notifications, newNotifications)

    return (
        <>
            {
                newNotifications?.map((notification: any, index: number) => (
                    <div key={index} className='add-friend-notific' >
                        <img src={ notification.avatar } alt="sender_avatar" />
                        <span id='notific-user' >{ notification.sender.username }</span>
                        <span id='notific-title'>{ notification.content }</span>
                        <button id='accept' onClick={() => handleAccept(notification)} ></button>
                        <button id='refuse' onClick={() => handleRefuse(notification)}></button>
                    </div>
                ))
            }
            <div className='play-notific' /*onClick={handelPlay}</>*/ >
                <img src="/src/imgs/example.jpg" alt="hlwa" />
                <span id='notific-user' >hamid</span>
                <span id='notific-title'>Let's Play</span>
            </div>
            <div className='add-friend-notific' ></div>
            <div className='add-friend-notific' ></div>
            <div className='add-friend-notific' ></div>
            <div className='add-friend-notific' ></div>
            <div className='add-friend-notific' ></div>
        </>
    )
}


function NavBarTwo (props:any) {

    const { client, updateClient }  = useClient();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const [orientation, setOrientation] = useState<number>(window.orientation);
    const [isNotificOpen, setIsNotificOpen] = useState(false);
    const [listItems, setListItems] = useState<JSX.Element>();
    const navigate = useNavigate();

    const openDrop =  document.querySelector('.drop-menu2') as HTMLElement;
    const openNotification =  document.querySelector('.drop-notification') as HTMLElement;
    const newNotification =  document.getElementById('newNotificaion') as HTMLElement;
    
    // const listNotific:JSX.Element = (
    // <>
    //     <div className='notifics' >
    //         <img src="/src/imgs/example.jpg" alt="hlwa" />
    //         <span id='notific-user' >hamid</span>
    //         <span id='notific-title'>Friend</span>
    //         <button id='accept'> </button>
    //         <button id='refuse'></button>
    //     </div>
    //     <div className='notifics' ></div>
    //     <div className='notifics' ></div>
    //     <div className='notifics' ></div>
    //     <div className='notifics' ></div>
    //     <div className='notifics' ></div>
    //     <div className='notifics' ></div>
    // </>
    // )




    const handleLogout = async() => {
        try {
            await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logout`, 
                {withCredentials: true,}
            )
        } catch (error) {
            console.error('Error logout: ', error);
        }
        updateClient(new Client);
        navigate('/')
    }

    const handleMenuOpen = () => {

        if (!openDrop) 
            return ;
        if (!isMenuOpen)
            openDrop.style.height = '0px';
        else {
            if (!window.matchMedia('(orientation: landscape)').matches) {
                setListItems(
                    <>
                        <li key="home"> <Link to='/' > Home </Link> </li>
                        <li key="profile1"> <Link to='/profile' > Profile </Link> </li>
                        <li key="chat"> <Link to='/chat'> Chat </Link> </li>
                        <li key="play"> <Link to='/play' > Play </Link> </li>
                        <li key="leaderboard"> <Link to='/leaderboard' > Leaderboard </Link> </li>
                        <li key="logout" id="logout" onClick={handleLogout} >  LogOut </li>
                    </>)
                openDrop.style.height = '250px'
            } else {
                setListItems( <li key="logout" id="logout"  onClick={handleLogout} >  LogOut  </li> )
                openDrop.style.height = '50px'
            }
        }
    };


    const handleNotificOpen = () => {
        
        if (!openNotification)
            return ;
        if (!isNotificOpen)
            openNotification.style.height = '0px';
        else {
            newNotification.style.display = 'none'
            if (window.innerWidth >= 900)
                openNotification.style.height = '200px';
            else
                openNotification.style.height = '100px'
        }
    }

    useEffect(() => {
        handleMenuOpen();
    }, [isMenuOpen]);

    useEffect(() => {
        handleNotificOpen();
    }, [isNotificOpen]);

    
    return ( 
        <>
            <div className='NavBarTwo'>
                <Link to='/' >
                    <img className='logo-img1'  src="/src/imgs/mskota.png" alt="Mskota-logo" />
                </Link>
                <div className='right-bar'>
                    <button  id='notificDrop' onClick={() => {setIsNotificOpen(!isNotificOpen)}}  onBlur={() => {setIsNotificOpen(false)}} >
                        <img className='notification' src="/src/imgs/notification.png" alt="Notification" />
                        <div id='newNotificaion'></div>
                    </button>
                    <div className='drop-notification'>
                        <ListNotification />
                    </div>
                    <button id='drop2' onClick={() => {setIsMenuOpen(!isMenuOpen)}}  onBlur={() => {setIsMenuOpen(false)}} > 
                        <img className='user-img2' src={client.avatar} alt="user-img"/>
                    </button>
                </div>
                <ul className="drop-menu2" >
                    {listItems}
                </ul>
            </div>
        </>
    )

}


export default NavBarTwo;