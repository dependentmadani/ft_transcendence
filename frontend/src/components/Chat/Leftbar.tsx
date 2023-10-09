import axios from "axios";
import { Chats } from "./Chats/Chats";
import { Search } from './Search/Search';
import { useEffect, useState } from "react";

interface Chat {
  chatId: number,
  chatUsers: number[],
  latestMessageContent: string,
  latestMessageDate: Date,
  sender: User,
  receiver: User,
  type: string,
}

interface User {
  id: number,
}


export  const Leftbar = ({ onValueChange, chatData }: any) => {

  const [selectedChat, setSelectedChat] = useState<{}>([]);
  // const [mainUser, setMainUser] = useState<User>()

  
  // useEffect(() => {
  //   const getMainUser = async () => {
  //     try {
  //       const user = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true})
  //       setMainUser(user.data)
  //     }
  //     catch (err) {
  //       console.log(`Coudn't fetch main user: `, err)
  //     }
  //   }

  //   getMainUser()
  // }, [])


  // Set the selected chat by the user
  const handleSelectedChat = async (chat: Chat) => {
    
    const mainUser: User = (await (axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, {withCredentials: true}))).data
    const sender = chat.chatUsers[0] === mainUser?.id ? chat.chatUsers[0] : chat.chatUsers[1];
    const receiver = chat.chatUsers[0] === mainUser?.id ? chat.chatUsers[1] : chat.chatUsers[0];
    const sen = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/${sender}`, {withCredentials: true});
    const rec = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/${receiver}`, {withCredentials: true});
    
    const _chat: Chat = {
      chatId: chat.chatId,
      chatUsers: [sender, receiver],
      sender: sen.data,
      receiver: rec.data,
      latestMessageDate: chat.latestMessageDate,
      latestMessageContent: chat.latestMessageContent,
      type: chat.type,
    };

    const type='chat'
    setSelectedChat({_chat, type})
    onValueChange({_chat, type})
  }

  return (
    <div id='leftSidebar' className="leftSidebar">
        <Search selectedChat={handleSelectedChat} chatData={ chatData } />
        <Chats onValueChange={onValueChange} chatData={ chatData } />
    </div>
  )
}
