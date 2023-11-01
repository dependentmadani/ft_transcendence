

import './HomeGame.css';
import { Link } from 'react-router-dom';

// import { newRoomRef } from './match';
// export const RoomRef = newRoomRef;

export default function HomeGame()
{

  return (
    <div className="GameHome">
      <div className="Akinator">
      <Link to="akinator">
          <button className="akinatorButton">
            <img className='akinat' src='/src/assets/img/akinat.png' alt="Akinator" />
          </button>
      </Link>
      </div>
      <div className="PongClassic">
      <Link to="classicgame">
        <button className="PongClassic">
          <img className='classic' src='/src/assets/img/classic.jpg' alt="Classic" />
        </button>
      </Link>
      </div>
      <div className="PingPong">
      <Link to="matchgame">
        <button className="PingPong">
          <img className="match" src="/src/assets/img/match.jpg" alt="MatchGame" />
        </button>
        </Link>
      </div>
    </div>
  );
}


