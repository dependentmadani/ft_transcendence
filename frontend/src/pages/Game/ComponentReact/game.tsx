
import { Route, Routes, BrowserRouter} from 'react-router-dom';
import Akinator from './akinator';
import "./game"
import ClassicGame from './classic_game';
import MatchGame from './match';
import Chat from '../privategame/ChatGame';
import PrivateMatchGame from '../privategame/privateMatch';
import { JoinRoom } from '../privategame/ChatGame';
import HomeGame from './HomeGame';
import { Link } from 'react-router-dom'

export function InviteFriends()
{
  return(
    <>
    <JoinRoom/>
    <Chat/>
    </>
  )
}

export const Game = () => {

  return (
    <div className='game'>
      {/* <span><Link to='akinator'>akinator</Link></span>
      <span><Link to='ClassicGame'>ClassicGame</Link></span>
      <span><Link to='ClassicGame'>ClassicGame</Link></span> */}
      {/* <BrowserRouter>
      <Routes>
        <Route path="/"  element={<HomeGame />} />
        <Route path="/akinator" element={<Akinator/>} />
        <Route path="/classicgame" element={<ClassicGame/>} />
        <Route path={"/matchgame"} element={<MatchGame/>} />
        <Route path="/InviteFriends" element={<InviteFriends/>} />
        <Route path={`/PrivateMatchGame`} element={<PrivateMatchGame/>} />
      </Routes>
    
    </BrowserRouter> */}
    <HomeGame />
    </div>
  );
}


