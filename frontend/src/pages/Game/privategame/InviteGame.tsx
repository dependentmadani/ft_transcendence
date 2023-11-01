
import './InviteGame.css';
import { Link } from 'react-router-dom';


export default function InviteGame()
{
  
  return (
    <div className="GameHome">
      <div className="PongClassic">
      <Link to={`InviteClassic`}>
        <button className="PongClassic">
          <img className='classic' src='./src/assets/img/classic.jpg' alt="Classic" />
        </button>
      </Link>
      </div>
      <div className="PingPong">
      <Link to={`InviteMatch`}>
        <button className="PingPong">
          <img className="match" src="./src/assets/img/match.jpg" alt="MatchGame" />
        </button>
        </Link>
      </div>
      
    </div>
  );
}


