import React from 'react';
import { useEffect, useState, useRef } from 'react'
import './Settings.css';
import { useClient } from '@/context/clientContext';
import { ToastContainer, toast } from 'react-toastify';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { useSetting } from '@/context/SettingContext';
import axios, { Axios } from "axios";
import { useNavigate } from 'react-router-dom';
import { useFetch } from '@/context/fetchContext';


const SettingsComponent: React.FC = (props:any) => {

	const {client, updateClient} = useClient();
  const [chat, setChat] = useState<boolean>(false);
  const [blocked, setBlocked] = useState<boolean>(false);
  const navigate = useNavigate(); 
  // const [popSettings, setPopSettings] = useSetting();
  const [fetch, setFetch] = useFetch();
  // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
  // console.log('userId : ', props.user.id)
  // console.log('chat : ', chat, ' blocked : ', blocked)


  async function blockChat () {
    try {
      // console.log(')))))))))))))))))))))):')
      const res = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/block-friend/${props.user.id}`, {}, {withCredentials: true,});
      // console.log(`/profile/${props.user.username}`);
      setFetch(false)
    
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
  } 

  async function unblockChat () {
    try {
      // console.log('(((((((((((((((((((((((:')
      const res = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/unblock-friend/${props.user.id}`, {}, {withCredentials: true,});
      // console.log(`/profile/${props.user.username}`);
      setFetch(false)
    
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
  } 


    useEffect (() => {

      const checkUser = () => {
        // console.log('blocked : ' , client.blocked)
        const checker = client.blocked.filter(user => user.username === props.user.username);
        // console.log('checker : ', checker)
        if (checker.length)
          setBlocked(true);
      }
      
      checkUser()
      if (chat) {
        // console.log('------=====0----------')
        if (!blocked)
          blockChat();
        else
          unblockChat();
      }
    }, [chat])

    return (
      <div className="settings-noFriend">
          <img src={blocked ? "/src/imgs/unblock.png" : "/src/imgs/no-chat.png" } alt="no-chat"  onClick={() => {setChat(true)}} />
      </div>
    );
}

export default SettingsComponent;