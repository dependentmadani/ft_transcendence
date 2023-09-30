import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { RoomCreationModal } from './RoomCreationModal'
import { useState } from "react";

export  const CreateRoom = () => {

  const [showForm, setShowForm] = useState(false);

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

    const createNewRoom = async () => {
        try {
          return await axios.post(`http://${process.env.VITE_BACK_ADDRESS}/room`, {
            roomName: 'Ghorfa',
            roomAvatar: 'https://moodoffdp.com/wp-content/uploads/2023/06/Best-Meme-PFP-1-1024x1024.jpg',
            roomUsers: [1],
            role: 'ADMIN'
          })
        }
        catch (err)
        {
          console.log(`Couldn't create new Room: `, err)
        }
    }
    
    const createAroom = () => {
        // if (inputText.trim() !== '') {
          createNewRoom()
          console.log('Ghaaaayarha')
        //   chatData._socket?.emit("newMessage", inputText);
        //   setInputText('')
          
        //   const newMessage = {
        //     textContent: inputText,
        //     msgChatId: chatData._chat?.chatId,
        //   };
        //   setMessages([...messages, newMessage]);
    }


    

  
    
    return (
        <div className="createRoom">
            <div className="createRoomIcon" onClick={openForm}><FontAwesomeIcon icon={faUserGroup} /></div>
            {showForm && <RoomCreationModal onClose={closeForm} />}
        </div>
    )
}
