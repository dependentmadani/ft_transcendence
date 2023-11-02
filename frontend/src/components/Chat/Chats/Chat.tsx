import { useEffect, useState } from "react"
import { Input } from '../Input'
import { PromptPassword } from "../Rooms/PromptPassword"
import axios from "axios"
import { Messages } from "../Messages/Messages"


export const Chat = ({ chatData, messages }: any) => {

  
  const [showForm, setShowForm] = useState(false);

  
  useEffect(() => {
    const checkAllow = async () => {

      if (chatData?._chat?.type === 'Room') {
        const isAllowed = (await axios.get(`http://localhost:8000/roomUsers/is-allowed/${chatData?._chat?.id}/${chatData._mainUser.id}`, { withCredentials: true })).data
        if (isAllowed)
          setShowForm(false);
        else
          setShowForm(true)
      }
    }

    checkAllow()
  }, [ chatData ])
  


  const openForm = () => {
    if (showForm === false)
      setShowForm(true);
    else
      setShowForm(false)
  };


  return (
    <div id='Conversation' className={`chat`}>
      { showForm && <PromptPassword onClick={openForm} openForm={openForm} chatData={chatData} /> }
      <Messages chatData={chatData} messages={ messages } />
      <Input chatData={ chatData } />
    </div>
  )
}