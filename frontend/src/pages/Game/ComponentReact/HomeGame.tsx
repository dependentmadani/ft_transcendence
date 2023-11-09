import './HomeGame.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';




export default function HomeGame() {

  const navigate = useNavigate();

  const updateWidth = () => {
    const styleModes = document.querySelectorAll('.style-mode');
    const gameMode = document.querySelector('.GameHome') as HTMLElement;
    
    if (styleModes.length > 0 && gameMode) {
      styleModes.forEach((styleMode) => {
        const width = gameMode.getBoundingClientRect().width *  0.35 ;
        const height = gameMode.getBoundingClientRect().height * 0.35 ;
        
        if (window.innerWidth > window.innerHeight) {
          (styleMode as HTMLElement).style.width = `${height}px`;
          (styleMode as HTMLElement).style.height = `${height}px`;
        } else {
          (styleMode as HTMLElement).style.width = `${width}px`;
          (styleMode as HTMLElement).style.height = `${width}px`;
        }
      });
    }
  };
  
  

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
  
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, [])

  return (
    <div className="GameHome">
      <div className="style-mode" onClick={() => {navigate('/game/classic')}} >
        <span>Classic <br/>&nbsp;&nbsp;&nbsp;Mode</span>
          <img  src='/src/imgs/classic.png' alt="Classic"  />
      </div>
      <div className="style-mode" onClick={() => {navigate('/game/tennis')}}>
        <span>Tennis <br/>&nbsp;&nbsp;&nbsp;Mode</span>
          <img  src="/src/imgs/tennis.png" alt="MatchGame"  />
      </div>
      <div className="style-mode" onClick={() => {navigate('/game/akinator')}} >
          <span>Akinator <br/>&nbsp;&nbsp;&nbsp;Mode</span>
          <img src='/src/imgs/akinator.png' alt="Akinator"  />
      </div>
    </div>
  );
}





