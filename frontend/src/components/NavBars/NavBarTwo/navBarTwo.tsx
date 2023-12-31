import './navBarTwo.css'
import { Link, useNavigate } from "react-router-dom"
import  { useEffect, useState, useRef } from 'react';
import { useClient } from '@/context/clientContext';
import Client from '@/components/ClientClass/client';
import axios from 'axios';
// import { Socket } from 'socket.io-client';
import { useSocket } from '@/context/socketContext';
import { toast } from 'react-toastify';
import { useGame } from '@/context/GameContext';
// import { useFetch } from '@/context/fetchContext';
import { useNotif } from '@/context/newNotif';
import { useUrl } from '@/context/UrlContext';
import { useStart } from '@/context/startContext';

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


const ListNotification = () => {

    const [notifications, setNotifications] = useState<Notifications[]>([])
    const [newNotifications, setNewNotifications] = useState<Notifs[]>([])
    const {socketa} = useSocket();
    const {setGame} = useGame();
    const { setNewNotif}= useNotif();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchNotifications = async () => {
          try {
            const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/notifications`, {withCredentials: true})
            setNotifications(res.data)
          }
          catch  {
            // console.log('No Notifications')
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
                        content: ' wants to connect',
                        mode: notification.mode,
                    };

                    if (newNotif.status === false && newNotif.receiver.id === mainUser.id && newNotif.type === 'FRIEND')
                        return newNotif
                    return null
                })
                );
                const filteredNotificationsData: any = newNotificationsData.filter((notification) => notification !== null);
                setNewNotifications(filteredNotificationsData);
            }
            catch  {
            //   console.log('Error fetching users for chats: ', err);
            }
        }

        getNotifications()
    }, [ notifications ])

    useEffect(() => {
        socketa?.on('receiveNotification', async (notif: any) => {

            const sender = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/${notif.senderId}`, {withCredentials: true})).data;
                    
            const newNotif: Notifs = {
                id: notif.id,
                sender: sender,
                receiver: notif.receiverUser,
                status: notif.read,
                avatar:notif.receiverUser.avatar,
                type: notif.type,
                content: ' wants to connect',
                mode: notif.mode,
            };

            if (newNotif.type === 'FRIEND') {
                setNewNotifications([...newNotifications, newNotif]);
                setNewNotif(true)
            }
            else if (newNotif.type === 'GAME') {
                toast.info(`${newNotif.receiver.username} invites you to play ${newNotif.type} PongGame`, {
                    position: toast.POSITION.TOP_RIGHT,
                    onClick: () => {
                        setGame({playerID1: newNotif.sender.id, playerID2: newNotif.receiver.id, mode: newNotif.mode})
                        socketa?.emit('acceptNotification', { notif: newNotif });
                        navigate('/game/invite')
                    }
                });
            }


                return () => {
                    socketa?.off('receiveNotification');
                };
            });
    
      }, [ socketa ]);



    // Handle friend request or Game invitaion function
    const handleAccept = async (notif: Notifs) => {
        setNewNotif(false);

        if (notif.type === 'FRIEND') { // Handling friend request
            try {
                 await axios.put(
                  `http://${import.meta.env.VITE_BACK_ADDRESS}/notifications/accept-friend`,
                  {
                    senderId: notif.sender.id,
                    receiverId: notif.receiver.id,
                    id: notif.id,
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    withCredentials: true, // Include credentials for cross-origin requests
                  }
                );
          
                // console.log('NEW FRIENDS', data);
                setNewNotifications((prevMembers) => prevMembers.filter((n) => n.id !== notif.id));
                socketa?.emit('acceptNotification', { notif: notif });
              } catch  {
                // Handle any error that might occur during the request
                // console.log('Error accepting friend request', error);
              }
        }

        try {
             await axios.put(
              `http://${import.meta.env.VITE_BACK_ADDRESS}/notifications/${notif.id}`,
              null, // No request body needed for this request
              {
                withCredentials: true, // Include credentials for cross-origin requests
              }
            );
        
            // console.log('NOTIFICATION UPDATED', data);
          } catch  {
            // Handle any error that might occur during the request
            // console.log('Error updating notification', error);
          }

    }


    // Handle Refuse of friend request or Game invitation
    const handleRefuse = async (notif: Notifs) => {
        setNewNotif(false)

        // Removing the notificaiton
        try {
                const res = await axios.delete(`http://${import.meta.env.VITE_BACK_ADDRESS}/notifications/${notif.id}/${notif.sender.id}/${notif.receiver.id}`,  { withCredentials: true })
                console.log('res', res.data)
        }
        catch  {
            // console.log(`Coudn't delete notification: `, err)
        }

        setNewNotifications(prevMembers => prevMembers.filter(n => n.id !== notif.id));
    }


    return (
        <>
            {
                newNotifications?.map((notification: any, index: number) => (
                    <div key={index} className='add-friend-notific' >
                        <img src={ notification.sender.avatar } alt="sender_avatar" />
                        <span id='notific-user' >{ notification.sender.username }</span>
                        <span id='notific-title'>{ notification.content }</span>
                        <img id='accept' src="/src/assets/imgs/checked.png" alt="accept" onClick={() => handleAccept(notification)} />
                        <img id='refuse' src="/src/assets/imgs/cancel1.png" alt="refuse" onClick={() => handleRefuse(notification)} />
                    </div>
                ))
            }
        </>
    )
}


function NavBarTwo () {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const NotificRef = useRef<HTMLImageElement | null>(null);
    const dropRef = useRef<HTMLUListElement | null>(null);
    const MenuRef = useRef<HTMLImageElement | null>(null);
    const { client, updateClient }  = useClient();
    const [, setMyUrl] = useUrl();
    const [start] = useStart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {newNotif, setNewNotif} = useNotif();
    const [isNotificOpen, setIsNotificOpen] = useState(false);
    const [listItems, setListItems] = useState<JSX.Element>();
    const navigate = useNavigate();

    const openDrop =  document.querySelector('.drop-menu2') as HTMLElement;
    const openNotification =  document.querySelector('.drop-notification') as HTMLElement;


    const handleLogout = async() => {
        try {
            await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logout`, 
                {withCredentials: true,}
            )
        } catch  {
            // console.log('Error logout: ', error);
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
                        <li key="play"> <Link to='/game' > Game </Link> </li>
                        <li key="leaderboard"> <Link to='/leaderboard' > Leaderboard </Link> </li>
                        <li key="logout" id="logout" onClick={handleLogout} >  LogOut </li>
                    </>)
                openDrop.style.height = '250px'
            } else {
                setListItems( <li key="logout" id="logout"  onClick={handleLogout} >  LogOut  </li> )
                openDrop.style.height = '50px'
            }
        }
        setNewNotif(false);
    };


    const handleNotificOpen = () => {
        
        if (!openNotification)
            return ;
        if (!isNotificOpen)
            openNotification.style.height = '0px';
        else {
            setNewNotif(false)
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


    useEffect(() => {
      const handleClick = (event: MouseEvent) => {
        if ((targetRef.current && !targetRef.current.contains(event.target as Node)) && 
            (NotificRef.current && !NotificRef.current.contains(event.target as Node))) {
            setIsNotificOpen(false);
        }
        if ((dropRef.current && !dropRef.current.contains(event.target as Node)) && 
            (MenuRef.current && !MenuRef.current.contains(event.target as Node))) {
            setIsMenuOpen(false)
        }
      };
  
      document.addEventListener('click', handleClick);
  
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, [isNotificOpen, isMenuOpen]);
    

    const handel= () => {
        setIsNotificOpen(!isNotificOpen); 
        setNewNotif(false);
    }


    return ( 
        <>
            <div className='NavBarTwo'>
                <Link to='/' >
                    <img className='logo-img1'  src="/src/assets/imgs/mskota.png" alt="Mskota-logo" onClick={() => {if (start) setMyUrl(true)}} />
                </Link>
                <div className='right-bar'>
                    <button  id='notificDrop'   >
                        <img className='notification' src="/src/assets/imgs/notification.png" alt="Notification" ref={NotificRef} onClick={handel}  />
                        <div id='newNotificaion' style={!newNotif ? {display: 'none' } : {display: 'block'}}  ></div>
                    </button>
                    <div className='drop-notification'  ref={targetRef}  >
                        <ListNotification />
                    </div>
                    <button id='drop2'  > 
                        <img className='user-img2' src={client.avatar || '/src/assets/imgs/user-img.png'} alt="user-img" ref={MenuRef} onClick={() => {setIsMenuOpen(!isMenuOpen)}}  /*onBlur={() => {setIsMenuOpen(false)}} *//>
                    </button>
                </div>
                <ul className="drop-menu2" ref={dropRef} >
                    {listItems}
                </ul>
            </div>
        </>
    )

}

export default NavBarTwo;