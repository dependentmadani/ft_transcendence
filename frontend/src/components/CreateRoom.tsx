import axios from "axios"

export const CreateRoom = () => {

    const createNewRoom = async () => {
        try {
          return await axios.post('http://localhost:8000/room', {
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
            <button onClick={createAroom}>Create Room</button>
        </div>
    )
}
