
import { useEffect, useState } from 'react'
import './settings.css';
import { useClient } from '@/context/clientContext';
import axios from "axios";
import { useFetch } from '@/context/fetchContext';
import { useSocket } from '@/context/socketContext';

const SettingsComponent = (props:any) => {

	const {client} = useClient();
  const [chat, setChat] = useState<boolean>(false);
  const [blocked, setBlocked] = useState<boolean>(false); 
  const {setFetch} = useFetch();
  const {socketa} = useSocket();
    


  async function blockChat () {
    try {
      await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/block-friend/${props.user.id}`, {}, {withCredentials: true,});
      setFetch(false)
      socketa?.emit('lockChat', props.user.id)
    } catch  {
        // console.log('Error fetching data: ', error);
    }
  } 

  async function unblockChat () {
    try {
      await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/unblock-friend/${props.user.id}`, {}, {withCredentials: true,});
      setFetch(false)
    
    } catch  {
        // console.log('Error fetching data: ', error);
    }
  } 


    useEffect (() => {

      const checkUser = () => {
        const checker = client.blocked?.filter((user: {username: string}) => user.username === props.user.username);
        if (checker?.length)
          setBlocked(true);
      }
      
      checkUser()
      if (chat) {
        if (!blocked)
          blockChat();
        else
          unblockChat();
      }
    }, [chat])

    return (
      <div className="settings-noFriend">
          <img src={blocked ? "/src/assets/imgs/unblock.png" : "/src/assets/imgs/no-chat.png" } alt="no-chat"  onClick={() => {setChat(true)}} />
      </div>
    );
}

export default SettingsComponent;