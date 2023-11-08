import axios from "axios"
import { useEffect, useState } from "react"
import { useShow } from "@/context/ShowFormContext";


export  const Chats = ({ category, onValueChange, chatData }: any) => {

  
  const [contacts, setContacts] = useState<Contact[] | null>()
  const [, setShow] = useShow();
 


  useEffect(() => {

    // fetchChats()
    const fetchContacts = async () => {
      if (category === "Your Chats")
        setContacts((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/all-contacts`, {withCredentials: true})).data)
      else {
        setContacts((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/all-rooms`, {withCredentials: true})).data)
      }
    }

    chatData._socket?.on('sortingContacts', async () => {
      if (category === "Your Chats")
        setContacts((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/all-contacts`, {withCredentials: true})).data)
      else {
        setContacts((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/all-rooms`, {withCredentials: true})).data)
    }    })

    fetchContacts()
  }, [])

  useEffect(() => {
    chatData._socket?.on('sortingContacts', async () => {
      if (category === "Your Chats")
        setContacts((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/all-contacts`, {withCredentials: true})).data)
      else {
        setContacts((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/all-rooms`, {withCredentials: true})).data)
      }
    })

    
  }, [ chatData._socket ]) 



    const handleClick = (contact: Contact) => {
      // setSelectedChat({chat, type});
      if (contact.type === 'Chat')
        setShow('false');
      else
        setShow('true')
      onValueChange(contact)
    };


    return (
      <div className="chats">
          {
            contacts?.map((contact: Contact, index: number) => (
              <div className="userChats" key={index} onClick={() => {handleClick(contact) }}>
                <div className="chatAvatar">
                  <img className="avatar-img" src={ contact?.avatar } alt="user_avatar" />
                </div>
                <div className="chatData">
                  <span className="contact-name">{ (contact.name).length <= 8 ? contact.name : (contact.name)?.substring(0,8)+'...' }</span>
                  <p className="latest-message">{ contact?.latestMessageContent ? (contact?.latestMessageContent)?.length <= 8 ? contact?.latestMessageContent : (contact.latestMessageContent)?.substring(0,8)+'...' : 'No messages' }</p>
                </div>
                {/* { 0 && <span className="notifSpan">n</span>} */}
              </div>
            ))
          }
        </div>
    )
}
