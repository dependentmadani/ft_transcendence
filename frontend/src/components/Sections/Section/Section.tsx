import './Section.css'
import NavBarTwo  from '@/components/NavBars/NavBarTwo/navBarTwo'
import NavBarTree from '@/components/NavBars/NavBarTree/navBarTree';
import { HomeChat } from "@/pages/Chat/HomeChat";
import { Navigate, useParams } from 'react-router-dom';
import Profile from '@/pages/Profile/Profile';
import Leaderboard from '@/pages/Leadeboard/Leaderboard';
import HomeGame from '@/pages/Game/ComponentReact/HomeGame' 
import { useGame } from '@/context/GameContext';
import { default as InviteTennis } from '@/pages/Game/Invitegame/InviteMatch';
import InviteClassic from '@/pages/Game/Invitegame/InviteClassic';
const Test = () => {
    return (<>
        <div className='kika' >kika</div>
    </>)
}

const InviteGame = () => {

    //check data of ids of players
    const [_game] = useGame();

    if (_game.mode === 'classic')
        return <InviteClassic ProfileID1={_game.playerID1} ProfileID2={_game.playerID2} />
    else if (_game.mode === 'tennis')
        return <InviteTennis ProfileID1={_game.playerID1} ProfileID2={_game.playerID2} />
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
    else if (section === '/game/invite')
        return ( <InviteGame /> )
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