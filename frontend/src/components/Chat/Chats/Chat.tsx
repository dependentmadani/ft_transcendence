import { useEffect, useState } from "react"
import { Input } from '../Input'
import { PromptPassword } from "../Rooms/PromptPassword"
import axios from "axios"
import { Messages } from "../Messages/Messages"
import { useShow } from "@/context/ShowFormContext"

export const Chat = ({ chatData, messages }: any) => {

  const [isAllowed, setIsAllowed] = useState(true)
  // const [showForm, setShowForm] = useState(false);
  // const [test, setTset] = useState(true);
  const [show, setShow] = useShow();

  // const [test, setTest] = useState(false);

  
  useEffect(() => {
    const checkAllow = async () => {

      //console.log('##############')
      if (chatData?._chat?.type === 'Room') {
      //console.log('~~~~~~~~~~~~~~~~~~~~')

        const allowed = (await axios.get(`http://localhost:8000/roomUsers/is-allowed/${chatData?._chat?.id}/${chatData._mainUser.id}`, { withCredentials: true })).data
        if (allowed) {
          //console.log('666666666666666666')
          // setShow(false);
          // setTset(true)
          // setShowForm(false);
          setIsAllowed(true)
        }
        else {
          //console.log('1111111111111111111')
          // setTset(false)
          // setShow(true);

          // setShowForm(true)
          setIsAllowed(false)
        }
      }
      else {
        //console.log('daz mn hna')
        setIsAllowed(true)
      }
    }

    checkAllow()
  }, [ chatData, show])
  


  // const openForm = () => {
  //   // if (showForm === false)
  //   //   //console.log('-----------------showForm : ', showForm)  
  //   setTset(!test)

  //   // else
  //     // setShowForm(false)
  // };
  // //console.log('showForm : ', showForm);

  //console.log('ISALLOWED', isAllowed)

  return (
    <div id='Conversation' className={`chat`}>
      {show === 'true' && !isAllowed && < PromptPassword setIsAllowed={setIsAllowed}  chatData={chatData} /> }
      <Messages chatData={chatData} messages={ messages } />
      <Input chatData={ chatData } isAllowed={ isAllowed } />
    </div>
  )
}