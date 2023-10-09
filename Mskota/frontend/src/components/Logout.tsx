import { Link, Route, Routes, useNavigate } from "react-router-dom"
import axios from 'axios';
import { useClient } from '../client/clientContext';
import { useAuth } from '../client/authContext';


export const handleLogout = async() => {

    const { auth, updateAuth } = useAuth();
    const { client, updateClient }  = useClient();
    const navigate = useNavigate();

    try {
        await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logout`, 
            {withCredentials: true,}
        )
        // let tmp = client;
        // client.clean();
        // console.log("tmp : ")
        // console.log(tmp.clean)
        // socket.disconnect();
        // updateClient({...(client.clean)});
    } catch (error) {
        console.error('Error logout: ', error);
    }
    updateAuth(false);
    updateClient({...(client.clean)});
    navigate('/')
}

// export handleLogout;