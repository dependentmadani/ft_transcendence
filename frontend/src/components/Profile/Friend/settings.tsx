import React from 'react';
import { useEffect, useState, useRef } from 'react'
import './Settings.css';
import { useClient } from '@/context/clientContext';
import { ToastContainer, toast } from 'react-toastify';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { useSetting } from '@/context/SettingContext';
import axios, { Axios } from "axios";
import { useNavigate } from 'react-router-dom';


const SettingsComponent: React.FC = (props:any) => {

	const {client, updateClient} = useClient();
  const [chat, setChat] = useState<boolean>(false);
  const [friend, setFriend] = useState<boolean>(false);
  const navigate = useNavigate(); 
  const [popSettings, setPopSettings] = useSetting();
  // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
  console.log('userId : ', props.user.id)


    const blockChat = () => {
      ;
    } 

    async function unfriend () {
      try {
        const res = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/unfriend/${props.user.id}`, {}, {withCredentials: true,});
          console.log(`/profile/${props.user.username}`);
            // await updateClient({})
            setPopSettings(false);
            // await delay(1000);
            navigate(`/profile/${props.user.username}`)
            console.log('(((((((((((((((((((((((:')
      
      } catch (error) {
          console.error('Error fetching data: ', error);
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
          <img src="/src/imgs/no-chat.png" alt="no-chat"  onClick={() => {setChat(true)}} />
          <img src="/src/imgs/unfriend.png" alt="unfriend"  onClick={() => {setFriend(true)}} />
      </div>
    );
}

export default SettingsComponent;