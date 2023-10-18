import './Section.css'
import NavBarTwo  from '@/components/NavBars/NavBarTwo/navBarTwo'
import NavBarTree from '@/components/NavBars/NavBarTree/navBarTree';
import Profile from '@/components/Profile/Me/MyProfile';
import { HomeChat } from "@/pages/Chat/HomeChat";
// import ProfileFriend  from './profileFriend';
import { Navigate } from 'react-router-dom';

function selectSection(section: string): JSX.Element {

    if (section === '/profile')
        return ( <Profile />)
    // else if (section === 'test')
    //     return ( <ProfileFriend />)
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