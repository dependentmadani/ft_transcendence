import axios from "axios"
import { useEffect, useState } from "react"


export  const Chats = ({ onValueChange, chatData }: any) => {

  
  const [newRooms, setNewRooms] = useState<Room[]>([])
  const [contacts, setContacts] = useState<Contact[]>()
// 


  useEffect(() => {

    // fetchChats
    const fetchContacts = async () => {
      setContacts((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/all-contacts`, {withCredentials: true})).data)
    }

    fetchContacts()
  }, [])

  useEffect(() => {

    chatData?._socket?.on('sortingContacts', async () => {
      setContacts((await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/roomUsers/all-contacts`, {withCredentials: true})).data)
    })
  }, [ chatData._socket ])

    const handleClick = (contact: Contact) => {
      onValueChange(contact)
    };



    const roomListener = (room: Room, owner: number) => {
      if (newRooms.find(r => r.id === room.id) === undefined && chatData?.mainUser?.id == owner) {
        // setContacts([...contacts, room])
        const newRoom: Room = {
          id: room.id,
          roomName: room.roomName,
          roomAvatar: room.roomAvatar,
          roomType: room.roomType,
          // latestMessageDate: 'latestMessageDate',
          // latestMessageContent: 'latestMessageContent',
          type: 'room',
          roomPass: room.roomPass,
        };
        setNewRooms([...newRooms, newRoom])
      }
    }

    const leaveRoomListener = (roomId: number, owner: number) => {
      if (newRooms.find(r => r.id === roomId) !== undefined && chatData?.mainUser?.id === owner) {
        setNewRooms(prevMembers => prevMembers.filter(r => r.id !== roomId))
      }
    }
  

  
    useEffect(() => {
      
      chatData?._socket?.on('newRoom', roomListener);
      chatData?._socket?.on('leavingRoom', leaveRoomListener);
      // chatData?._socket?.on('sortChats', contactsSorting);
  
        return () => {
          chatData?._socket?.off('newRoom');
          chatData?._socket?.off('leavingRoom');
        };
    }, [roomListener, leaveRoomListener]);



    return (
        <div className="chats">
          {
            contacts?.map((contact: Contact, index: number) => (
              <div className="userChats" key={index} onClick={() => handleClick(contact)}>
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
