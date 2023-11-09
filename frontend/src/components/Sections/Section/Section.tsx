import './Section.css'
import NavBarTwo  from '@/components/NavBars/NavBarTwo/navBarTwo'
import NavBarTree from '@/components/NavBars/NavBarTree/navBarTree';
import { HomeChat } from "@/pages/Chat/HomeChat";
import { Navigate } from 'react-router-dom';
import Profile from '@/pages/Profile/Profile';
import Leaderboard from '@/pages/Leadeboard/Leaderboard';
import HomeGame from '@/pages/Game/ComponentReact/HomeGame';
import ClassicGame from '@/pages/Game/ComponentReact/classic';
import Akinator from '@/pages/Game/ComponentReact/akinator';
import Tennis from '@/pages/Game/ComponentReact/tennis';
import { default as InviteTennis } from '@/pages/Game/Invitegame/InviteMatch';
import InviteClassic from '@/pages/Game/Invitegame/InviteClassic';
import { useGame } from '@/context/GameContext';

const Test = () => {
    return (<>
        <div className='kika' >kika</div>
    </>)
}

const InviteGame = () => {

    const {game} = useGame();


    if (game.mode === 'classic')
        return <InviteClassic ProfileID1={game.playerID1} ProfileID2={game.playerID2} />
    else if (game.mode === 'tennis')
        return <InviteTennis ProfileID1={game.playerID1} ProfileID2={game.playerID2} />
}   


function selectSection(section: string): JSX.Element {


    if (section === '/profile/:username' || section === '/profile')
        return <Profile  />;
    else if (section === '/chat')
        return ( <HomeChat />)
    else if (section === '/leaderboard')
        return ( <Leaderboard /> )
    else if (section === '/game')
        return ( <HomeGame /> )
    else if (section === '/game/akinator')
        return ( <Akinator /> )
    else if (section === '/game/classic')
        return ( <ClassicGame /> )
    else if (section === '/game/tennis')
        return ( <Tennis /> )
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