import { useEffect, useState } from "react"
import axios from "axios"
import { Messages } from './Messages/Messages'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import io, { Socket } from 'socket.io-client';

// const socket = io(`http://localhost:8000`);

interface Message {
  id: number,
  textContent: string,
  msgRoomId: number,
  msgChatId: number,
  type: string,
}

// interface User {}

export const Input = ({ chatData }: any) => {

  const currentChat = chatData?._chat?.chat
  // chatData._socket = io(`http://localhost:8000`);
  
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    const _socket = io(`http://localhost:8000/chat`);
    setSocket(_socket)

    return () => {
      socket?.disconnect()
    }
  }, [setSocket]);

  const messageListener = (message: Message) => {
    // if (!chatMessages.find(m => m.id === message.id)) {
      if (message.type === 'chat')
        setChatMessages([...chatMessages, message])
      else  if (message.type === 'room')
        setRoomMessages([...roomMessages, message])
    // }
      // console.log('wow', message)
  }

  
  const [inputText, setInputText] = useState('')
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [roomMessages, setRoomMessages] = useState<Message[]>([])
  
  useEffect(() => {
    
    socket?.on('sendMessage', messageListener);
    console.log('socket', socket)

    return () => {
      socket?.off('sendMessage', messageListener);
    };
  }, [chatMessages, roomMessages]);


  // const [messages, setMessages] = useState<Message[]>([]);

  // useEffect(() => {
  //   console.log('w33333333333333333', chatData?._socket)
  //   chatData?._socket.on('message', (message: Message) => {
  //     // if (inputText) {
  //       console.log('w444444444444444')
  //       if (chatData?._chat?.type === 'chat') {
  //         setChatMessages(prevMessages => [...prevMessages, message]);
  //       } else if (chatData?._chat?.type === 'room') {
  //         setRoomMessages(prevMessages => [...prevMessages, message]);
  //       }
  //     // }
  //   });

  //   return () => {
  //     chatData?._socket.off('message');
  //   };
  // }, [chatData?._socket]);

  const createNewMessage = async (inputText: string) => {
    try {
      const _MAIN_USER_ = await (await axios.get(`http://localhost:8000/users/me`, {withCredentials: true})).data
      
      if (chatData._chat.type === 'chat') {
        const sender = currentChat?.chatUsers[0] === _MAIN_USER_.id ? currentChat?.chatUsers[0] : currentChat?.chatUsers[1];
        const receiver = currentChat?.chatUsers[0] === _MAIN_USER_.id ? currentChat?.chatUsers[1] : currentChat?.chatUsers[0];
        // console.log('WA L ID ', currentChat?.chatId, sender, receiver)
        
        return await axios.post(`http://localhost:8000/message/${chatData._chat.type}`, {
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
        
        // console.log('HOLAAA', currentChat)
        return await axios.post(`http://localhost:8000/message/${chatData._chat.type}`, {
          'msgRoomId': currentChat?.id,
          'MessageSenId': _MAIN_USER_.id,
          'textContent': inputText,
          'type': chatData._chat.type,
          // 'MessageRecId': receiver,
        }, {
          withCredentials: true
        })
        // console.log('MSG ROOM CREATED SUCC ', res)
      }
    }
    catch (err)
    {
      console.log(`Couldn't create new Message`, err)
    }
  }

  const handleClick = async () => {
    if (inputText.trim() !== '') {
      const msg: any = await createNewMessage(inputText)
      socket?.emit("message", msg.data);
      setInputText('')
      
      let newMessage: any
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
  
  const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (inputText.trim() !== '') {
        // createNewMessage(inputText)
        // socket?.emit("newMessage", inputText);
        const msg: any = await createNewMessage(inputText)
        // console.log('WAA ', msg.data)
        socket?.emit("message", msg.data);
        setInputText('')
  
        let newMessage: any
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
  }, [chatData?._chat])

  useEffect(() => {
    const fetchRoomMessages = async () => {
      try {
          if (currentChat.id !== undefined) {
            let roomMessages: Message[] = (await axios.get(`http://localhost:8000/message/${chatData._chat.type}/${currentChat?.id}`, { withCredentials: true }))?.data
            if (roomMessages !== undefined)
              setRoomMessages(roomMessages)
          }
      }
      catch (err) {
          console.log(`No message`)
      }
    }
    fetchRoomMessages()
  }, [chatData?._chat])

  // console.log('WeeeeeW', chatMessages[chatMessages.length-1]?.textContent)

  
  return (
    <>
    <Messages chatData={chatData} messages={ chatData?._chat?.type === 'chat' ? chatMessages : roomMessages } />

    <div className="input">
      <div className="inputContainer">
        <input type="text" placeholder="Type something..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} />
        <div className="send">
          {<span><FontAwesomeIcon icon={faPaperPlane} onClick={handleClick} /></span>}
        </div>
      </div>
    </div>
    </>
  )
}
