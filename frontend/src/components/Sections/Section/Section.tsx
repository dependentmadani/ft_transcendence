import './Section.css'
import NavBarTwo  from '@/components/NavBars/NavBarTwo/navBarTwo'
import NavBarTree from '@/components/NavBars/NavBarTree/navBarTree';
import { HomeChat } from "@/pages/Chat/HomeChat";
import { Navigate, useParams } from 'react-router-dom';
import Profile from '@/pages/Profile/Profile';
import Leaderboard from '@/pages/Leadeboard/Leaderboard';
import HomeGame from '@/pages/Game/ComponentReact/HomeGame' 

const Test = () => {
    return (<>
        <div className='kika' >kika</div>
    </>)
}


function selectSection(section: string): JSX.Element {

    console.log(section)

    if (section === '/profile/:username' || section === '/profile')
        return <Profile  />;
    else if (section === '/chat')
        return ( <HomeChat />)
    else if (section === '/leaderboard')
        return ( <Leaderboard /> )
    else if (section === '/game')
        return ( <HomeGame /> )
    else if (section === 'test')
        return ( <Test /> )
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