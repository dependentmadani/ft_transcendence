
import './ChatGame.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export let tooken  = ``;

export function JoinRoom()
{
  const [Token, setToken] = useState(``);
  const handleNameChange = (e:any) => {
    setToken(e.target.value);
  };
  
  const handleSubmit = (e:any) => {
    e.preventDefault();
    tooken = Token; 
    console.log('Name submitted:', Token);
  };
  return(
  <div className='joinRoom'>
  <form onSubmit={handleSubmit}> 
    <label>
      <input type='text' value={Token} onChange={handleNameChange} />
    </label>
      <input type='submit' value='Submit' />
 </form>
</div>
  )
}

export default function ChatGame()
{
  
  return (
    <div className="GameHome">
      <div className="PongClassic">
      <Link to="/classicgame">
        <button className="PongClassic">
          <img className='classic' src='./src/assets/img/classic.jpg' alt="Classic" />
        </button>
      </Link>
      </div>
      <div className="PingPong">
      <Link to={`/PrivateMatchGame`}>
        <button className="PingPong">
          <img className="match" src="./src/assets/img/match.jpg" alt="MatchGame" />
        </button>
        </Link>
      </div>
      
    </div>
  );
}


