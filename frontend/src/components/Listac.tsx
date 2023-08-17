// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// // async function fetchChats() {
// //   try {
// //     const response = await axios.get('http://localhost:8000/users')
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching Chats:', error);
// //   }
// // }

// interface users {
//   id: number
//   msg: string
// }

// // export const Listac: React.FC = () => {
// //   const [chats, setChats] = useState<Chat[]>([])

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const data = await fetchChats();
// //       // console.log('data: ', Chat)
// //       setChats(data);
// //     };
// //     fetchData();
// //   }, []);
// //   console.log('chats -> ', chats)

// //   return (
// //     <div>
// //       <h2>Chat List</h2>
// //       <ul>
// //         La7bass
// //         {/* {chats.map((chat) => (
// //           <li key={chat.id}>{chat.username}</li>
// //         ))} */}
// //       </ul>
// //     </div>
// //   );
// // };
// export const Listac: React.FC = () => {
//   const [chats, setChats] = useState<Chat[]>([]);

//   useEffect(() => {
//     // Fetch Chats from backend with token
//     const fetchChats = async () => {
//       try {
//         const token = '';
//         const response = await axios.get('http://localhost:3000/users', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setChats(response.data);
//       } catch (error) {
//         console.error('Error fetching Chats:', error);
//       ace users {
//   id: number
//   msg: string
// }}
//     };

//     fetchChats();
//   }, []);

//   console.log('data -> ', chats)
//   return (
//     <div>
//       <h1>Chat List</h1>
//       <ul>
//         {chats.map((chat) => (
//           <li key={chat.id}>{chat.username}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };


import { useState, useEffect } from 'react';
import axios from 'axios';

export function Listac() {
  const [users, setUsers] = useState([]);

    useEffect(() => {
      const fetchChats = async () => {
        try {
          const response = await axios.get('http://localhost:8000/chat');
          setUsers(response.data);
        }
        catch (error) {
          console.error('Error fetching Chats:', error);
        }
      };

      fetchChats();
  }, []);
  // useEffect(() => {
  //   axios.get('http://localhost:8000/chat')
  //     .then(response => setUsers(response.data))
  //     .catch(error => console.error(error));
  // }, []);

  console.log('data -> ', users)
  return (
    <div>
      <h1>Chat List</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user?.recId}</li>
        ))}
      </ul>
    </div>
  );
}
