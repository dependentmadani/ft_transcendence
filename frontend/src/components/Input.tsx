import { useEffect, useState } from "react"
import axios from "axios"
import { Messages } from './Messages/Messages'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import io from 'socket.io-client';

const socket = io(`http://localhost:8000`);

interface Message {
  textContent: string,
}

export const Input = ({ chatData, chat }: any) => {

  const currentChat = chatData?._chat?.chat
  // console.log('CURRENT L3IBAT', chatData?._chat?.type)

  // console.log('!!!!!!!!!', currentChat)

  const [inputText, setInputText] = useState('')
  const [chatMessages, setChatMessages] = useState<Message | null>([])
  const [roomMessages, setRoomMessages] = useState<Message | null>([])
  const [messages, setMessages] = useState<Message[]>([]);
  // const socket = io("http://localhost:8000");
  

  // useEffect(() => {
  //   chatData?._socket?.on('message', (message: Message) => {
  //     // Add the new message to the messages state
  //     console.log('Emittttttttttttttted here', chatData?._socket)
  //     setChatMessages(prevMessages => [...prevMessages, message]);
  //   });

  //   return () => {
  //     chatData?._socket?.disconnect();
  //   };
  // });

  useEffect(() => {
    // Listen for socket messages
    socket.on('message', (message: Message) => {
      console.log('w33333333333333333')
      if (inputText) {
        console.log('w444444444444444') 
        // Update chatMessages or roomMessages based on the chat type
        if (chatData?._chat?.type === 'chat') {
          setChatMessages(prevMessages => [...prevMessages, message]);
        } else if (chatData?._chat?.type === 'room') {
          setRoomMessages(prevMessages => [...prevMessages, message]);
        }
      }
    });

    return () => {
      // Clean up socket listener when component unmounts
      socket.off('message');
    };
  }, [chatData?._chat?.type]);

  const createNewMessage = async (inputText: string) => {
    try {
      const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
      // let type: string = ''
      // if (currentChat.type === 'chat')
      //   type = 'chat'
      // else if (currentChat.type === 'room')
      //   type = 'room'
  
      console.log('TYPPPPEEE', chatData._chat.type)
      
      if (chatData._chat.type === 'chat') {
        const sender = currentChat?.chatUsers[0] === _MAIN_USER_.id ? currentChat?.chatUsers[0] : currentChat?.chatUsers[1];
        const receiver = currentChat?.chatUsers[0] === _MAIN_USER_.id ? currentChat?.chatUsers[1] : currentChat?.chatUsers[0];
        console.log('WA L ID ', currentChat?.chatId, sender, receiver)
        
        const res = await axios.post(`http://localhost:8000/message/${chatData._chat.type}`, {
          'msgChatId': currentChat?.chatId,
          'MessageSenId': sender,
          'textContent': inputText,
          'type': chatData._chat.type,
          // 'MessageRecId': receiver,
        }, {
          withCredentials: true
        })
      }
      else if (chatData._chat.type === 'room'){
        
        console.log('HOLAAA', currentChat)
        const res = await axios.post(`http://localhost:8000/message/${chatData._chat.type}`, {
          'msgRoomId': currentChat?.id,
          'MessageSenId': _MAIN_USER_.id,
          'textContent': inputText,
          'type': chatData._chat.type,
          // 'MessageRecId': receiver,
        }, {
          withCredentials: true
        })
        console.log('MSG ROOM CREATED SUCC ', res)
      }
    }
    catch (err)
    {
      console.log(`Couldn't create new Message`, err)
    }
  }

  // chatData?.socket?.on('message', (inputText: string) => {
  //   console.log('Client received new message:', inputText);
  //   // Handle the received message in your application UI
  // });

  // const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  // useEffect(() => {
  //   socket.on('message', (inputText: string) => {
  //     // Add the new message to the messages state
  //     console.log('Client received new message:', inputText);
  //     setReceivedMessages((prevMessages) => [...prevMessages, inputText]);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [inputText]);
  
  // console.log('RECIEEEVED MSGS: ', receivedMessages)

  const handleClick = () => {
    if (inputText.trim() !== '') {
      createNewMessage(inputText)
      socket.emit("newMessage", inputText);
      setInputText('')
      
      let newMessage: Message= {}
      if (chatData?.chat?.type === 'chat') {
        newMessage = {
          textContent: inputText,
          msgChatId: currentChat?.chatId,
        };
        setChatMessages([...chatMessages, newMessage]);
      }
      else if (chatData?.chat?.type === 'room') {
        newMessage = {
          textContent: inputText,
          msgRoomId: currentChat?.id,
        };
        setRoomMessages([...roomMessages, newMessage]);
      }
    }
  }

  // const handleClick = async () => {
  //   if (inputText.trim() !== '') {
  //     // Send the message to the server
  //     chatData.socket.emit('newMessage', {
  //       chatId: chatData._chat.chatId,
  //       message: {
  //         textContent: inputText,
  //         msgRoomId: currentChat?.id,
  //       }
  //     });

  //     setInputText('');
  //   }
  // };
  // const [connectedSocket, setConnectedSocket] = useState(false)

  // useEffect(() => {
  //   chatData._socket.emit('setup', chatData._user)
  //   chatData._socket.on('connected', () => setConnectedSocket(true))
  // }, [])
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (inputText.trim() !== '') {
        createNewMessage(inputText)
        socket.emit("newMessage", inputText);
        setInputText('')
  
        let newMessage: Message= {}
        if (chatData?.chat?.type === 'chat') {
          newMessage = {
            textContent: inputText,
            msgChatId: currentChat?.chatId,
          };
          setChatMessages([...chatMessages, newMessage]);
        }
        else if (chatData?.chat?.type === 'room') {
          newMessage = {
            textContent: inputText,
            msgRoomId: currentChat?.id,
          };
          setRoomMessages([...roomMessages, newMessage]);
        }
      }
    }
  };
  
  // useEffect(() => {
  //   chatData._socket.emit('setup', chatData._user)
  //   chatData._socket.on('connected', () => setConnectedSocket(true))
  // }, [])

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        if (currentChat.chatId !== undefined)
          setChatMessages((await axios.get(`http://localhost:8000/message/${chatData._chat.type}/${currentChat?.chatId}`, {withCredentials: true}))?.data)
      }
      catch (err) {
          console.log(`No message`)
      }
    }
    fetchChatMessages()
  }, [currentChat?.chatId])

  useEffect(() => {
    const fetchRoomMessages = async () => {
      try {
          // console.log('MAAAAAAAALNAAAAAAAA')
          if (currentChat.id !== undefined) {
            let roomMessages: Message[] = (await axios.get(`http://localhost:8000/message/${chatData._chat.type}/${currentChat?.id}`, { withCredentials: true }))?.data
            // console.log('WAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', roomMessages)
            if (roomMessages !== undefined)
              setRoomMessages(roomMessages)
          }
      }
      catch (err) {
          console.log(`No message`)
      }
    }
    fetchRoomMessages()
  }, [currentChat?.id])

  console.log('WeeeeeW', chatMessages[chatMessages.length-1]?.textContent)

  
  return (
    <>
    <Messages messages={ chatData?._chat?.type === 'chat' ? chatMessages : roomMessages } />

    <div className="input">
      <div className="inputContainer">
        <input type="text" placeholder="Type something..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} />
        <div className="send">
          {/* <span><FontAwesomeIcon icon={faFaceSmile} /></span> */}
          <span><FontAwesomeIcon icon={faPaperPlane} onClick={handleClick} /></span>
        </div>
      </div>
    </div>
    </>
  )
}
