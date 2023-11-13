import { useEffect, useState } from 'react'
import './settings.css';
import axios from "axios";
import { useFetch } from '@/context/fetchContext';
import { useSocket } from '@/context/socketContext';

const SettingsComponent = ({userData} :any) => {

  const [chat, setChat] = useState<boolean>(false);
  const [friend, setFriend] = useState<boolean>(false);
  const { setFetch} = useFetch();
  const {socketa} = useSocket();


    async function blockChat () {
      try {
        await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/block-friend/${userData.id}`, {}, {withCredentials: true,});
          setFetch(false)
          socketa?.emit('lockChat', userData.id)
      
      } catch  {
          // console.log('Error fetching data: ', error);
      }
    } 

    async function unfriend () {
      try {
        await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/unfriend/${userData.id}`, {}, {withCredentials: true,});
            setFetch(false)
      
      } catch  {
          // console.log('Error fetching data: ', error);
      }
    }


    useEffect (() => {

      if (chat)
        blockChat();
      if (friend)
        unfriend();
    }, [chat, friend])

    return (
      <div className="settings-friend">
          <img src="/src/assets/imgs/no-chat.png" alt="no-chat"  onClick={() => {setChat(true)}} />
          <img src="/src/assets/imgs/unfriend.png" alt="unfriend"  onClick={() => {setFriend(true)}} />
      </div>
    );
}

export default SettingsComponent;