import './Section.css'
import NavBarTwo  from '@/components/NavBars/NavBarTwo/navBarTwo'
import NavBarTree from '@/components/NavBars/NavBarTree/navBarTree';
import MyProfile from '@/components/Profile/Me/MyProfile';
import { HomeChat } from "@/pages/Chat/HomeChat";
// import ProfileFriend  from './profileFriend';
import { Navigate, useParams } from 'react-router-dom';
import NotFriendProfile from  "@/components/Profile/NotFriend/NotFriendProfile"
import FriendProfile from "@/components/Profile/Friend/FriendProfile"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useClient } from '@/context/clientContext';

const checkProfile = () => {

    const [profile, setProfile] = useState('');
    const [data, setData] = useState(null);
    const username = useParams().username;

    console.log('holllllllllllllllla : ', username)

    useEffect(() => {
        async function getUsers() {

            try {
                const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/search/${username}`, { withCredentials: true });
                console.log(res.data)
                if (res.data.length) {
                    setData(res.data)
                    setProfile('Friend')
                }
                else {
                    try {
                        const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/globalSearch/${username}`, { withCredentials: true });
                        console.log(res.data)
                        setData(res.data)
                        setProfile('NotFriend')
                    } catch (error) {
                        console.error('Error fetching data: ', error);
                    }
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }

        getUsers();
    },[]);


    console.log('user : ', data)
    return (
        <>
            {data && <FriendProfile userData={data} />}
            
            {/* {(data && profile === 'Friend') && <FriendProfile userData={data} />}
            {(data && profile === 'NotFriend') && <NotFriendProfile userData={data} />} */}
        </>
    )
}



const Test = () => {
    return (
        <div className='pppp'>
            <div id='pp'></div>
            <div id='pp'></div>
            <div id='pp'></div>
            <div id='pp'></div>
            {/* <div></div>
            <div></div>
            <div></div> */}
        </div>
    )
}


function selectSection(section: string): JSX.Element {

    console.log(section)

    if (section === '/profile')
        return ( <MyProfile />)
    else if (section === '/profile/:username')
        return checkProfile();
    else if (section === '/chat')
        return ( <HomeChat />)
    else if (section === 'test')
        return (<Test />)
    else if (section === 'test1')
        return (<FriendProfile />)
    else if (section === 'test2')
        return (<NotFriendProfile />)
    else 
        <Navigate to='/' />
    return <></>
}

function Section (props:any) {

    return (
        <div className='root-section'>
                <NavBarTwo/>
            <div className='main-section'>
                <div className='NavBarTree'>
                    <NavBarTree/>
                </div>
                <div className='select-section'>
                    {selectSection(props.section)}
                </div>
            </div>
        </div>
    ) 
}

export default Section;