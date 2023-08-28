import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

export const Chattest = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const socket = io('http://localhost:8000'); // Replace with your server URL

  useEffect(() => {
    socket.on('message received', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, [socket]);

  const sendMessage = () => {
    socket.emit('sendMessage', messageInput);
    setMessageInput('');
  };

  return (
    <div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};
