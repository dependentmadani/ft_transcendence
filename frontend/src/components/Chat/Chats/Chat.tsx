import { useEffect, useState } from "react"
import { Input } from '../Input'
import { PromptPassword } from "../Rooms/PromptPassword"
import axios from "axios"
import { Messages } from "../Messages/Messages"
import { useShow } from "@/context/ShowFormContext"
import { Rightbar } from "../Rightbar"

export const Chat = ({ state, chatData, messages }: any) => {

  const currentRoom: Contact = chatData?._chat
  const [isAllowed, setIsAllowed] = useState(false)
  // const [showForm, setShowForm] = useState(false);
  // const [test, setTset] = useState(true);
  const [show, setShow] = useShow();

  // const [test, setTest] = useState(false);

  console.log('3ajiiiiiiiiiiiiiib')
  useEffect(() => {
    const checkAllow = async () => {

      console.log('##############')
      if (chatData?._chat?.type === 'Room') {
      console.log('~~~~~~~~~~~~~~~~~~~~')
          const isAdmin = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/is-admin/${currentRoom.id}/${chatData._mainUser.id}`, {withCredentials: true})).data
          if (isAdmin) {
            setIsAllowed(true);
            // setShow(true);
          }
          else {
            const firstAllow = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/is-allowed/${chatData?._chat?.id}/${chatData._mainUser.id}`, { withCredentials: true })).data
            console.log('firstAllow', firstAllow)
            if (firstAllow) {
              setIsAllowed(true);
            }
            else {
              // const roleRoom = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/room/${currentRoom.id}`, { withCredentials: true })).data.roomType
              // const allowed = (await axios.get(`http://localhost:8000/roomUsers/is-allowed/${chatData?._chat?.id}/${chatData._mainUser.id}`, { withCredentials: true })).data
              console.log('waaaaa haaaamiiiiiiiiiiiiid', chatData?._chat?.protection);
              console.log('isAllowed : ', isAllowed)

              if (chatData?._chat?.protection === 'Public') {
                console.log('666666666666666666');
                const allowed = (await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/is-allowed/${chatData?._chat?.id}/${chatData._mainUser.id}`, { withCredentials: true })).data
                if (!allowed && state === true) {
                  setIsAllowed(true);
                  const ret = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers`, {
                        roomId: currentRoom.id,
                        userId: chatData._mainUser.id,
                        userUsername: chatData._mainUser.username,
                        role: 'MEMBER',
                        allowed: true,
                    },
                    {
                        withCredentials: true,
                    });
                    console.log('-----------checker----------', ret);
                  // setShow(false);
                  // setTset(true)
                  // setShowForm(false);
                  }
                }
                else {
                  console.log('1111111111111111111');
                  // setTset(false)
                  // setShow(true);
        
                  // setShowForm(true)
                  setIsAllowed(false)
              }
            }
          }
      }
      else {
        console.log('daz mn hna')
        setIsAllowed(true)
      }
    }

    checkAllow()
  }, [ show])
  


  // const openForm = () => {
  //   // if (showForm === false)
  //   //   console.log('-----------------showForm : ', showForm)  
  //   setTset(!test)

  //   // else
  //     // setShowForm(false)
  // };
  // console.log('showForm : ', showForm);

  console.log('ISALLOWED', isAllowed)

  return (
    <div id='Conversation' className={`chat`}>
      {show === 'true' && !isAllowed && < PromptPassword setIsAllowed={setIsAllowed}  chatData={chatData} /> }
      <Messages chatData={chatData} messages={ messages } />
      <Input chatData={ chatData } isAllowed={ isAllowed } />
    </div>
  )
}