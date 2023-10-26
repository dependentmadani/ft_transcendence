import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { RoomCreationModal } from './RoomCreationModal'
import { useState } from "react";

export  const CreateRoom = ({ chatData }: any) => {

  const [showForm, setShowForm] = useState(false);

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

    
    return (
        <div className="createRoom">
            <div className="createRoomIcon" onClick={openForm}><FontAwesomeIcon icon={faUserGroup} /></div>
            { showForm && <RoomCreationModal onClose={closeForm} chatData={chatData} /> }
        </div>
    )
}
