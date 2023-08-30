import  { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons';

interface FourthChildProps {
  onClose: () => void;
}

export const RoomCreationModal = ({ onClose }: any) => {

    const [roomName, setRoomName] = useState('')

    const handleClick = () => {
        if (roomName.trim() !== '') {
        //   createNewMessage(inputText)
          setRoomName('')
        }
    }

    console.log('room name is ', roomName)

    return (
        <div className="overlay">
        <div className="form-container">
            <h2>Fill the Form wlla sir tl3ab</h2>
            <div className="roomFomrs">
                <div className="roomFormInfos">
                    <input type="text" placeholder="Room name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                    <span><FontAwesomeIcon className='importAvatarIcon' icon={faImage} /></span>
                </div>
                {/* Your form elements here */}
                <span onClick={handleClick}><FontAwesomeIcon icon={faPaperPlane} /></span>
            </div>
        </div>
        <span onClick={onClose}><FontAwesomeIcon icon={faCircleXmark} /></span>
        </div>
    );
};
