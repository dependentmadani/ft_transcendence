// ChatComponent.tsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000"); // Replace with your server URL

export const Chattest: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("chatMessage", message);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("chatMessage", (data: string) => {
      setChatHistory((prevHistory) => [...prevHistory, data]);
    });
  }, []);

  return (
    <div>
      <div>
        {chatHistory.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

