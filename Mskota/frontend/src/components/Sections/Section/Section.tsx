import './Section.css'
import NavBarTwo  from '@/components/NavBars/NavBarTwo/navBarTwo'
import NavBarTree from '@/components/NavBars/NavBarTree/navBarTree';
import MyProfile from '@/components/Profile/Me/MyProfile';
import { HomeChat } from "@/pages/Chat/HomeChat";
// import ProfileFriend  from './profileFriend';
import { Navigate } from 'react-router-dom';
import NotFriendProfile from  "@/components/Profile/NotFriend/NotFriendProfile"
import FriendProfile from "@/components/Profile/Friend/FriendProfile"



function selectSection(section: string): JSX.Element {

    console.log(section)

    if (section === '/profile')
        return ( <MyProfile />)
    else if (section === 'test1')
        return ( <FriendProfile />)
    else if (section === 'test2')
        return ( <NotFriendProfile />)
    else if (section === '/chat')
        return ( <HomeChat />)
    // else if (section === 'chat')
    //     return ( <HomeChat />)
    // else if (section === 'chat')
    //     return ( <HomeChat />)
    else 
        <Navigate to='/' />
    return <></>
}

function Section (props:any) {

//   console.log('section')

//     useEffect(() => {
//         const sourceElement = document.querySelector('.NavBarTwo') as HTMLElement;
//         console.log(sourceElement.offsetHeight)
//     }, []);

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