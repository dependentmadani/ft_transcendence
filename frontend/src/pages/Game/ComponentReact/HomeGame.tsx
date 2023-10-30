import './HomeGame.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// import { newRoomRef } from './match';
// export const RoomRef = newRoomRef;



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
      <div className="style-mode">
        <span>Mode <br/>Classic</span>
          <img  src='/src/imgs/classic.png' alt="Classic" onClick={() => {navigate('/game/classic')}} />
      </div>
      <div className="style-mode">
        <span>Mode <br/>Tennis</span>
          <img  src="/src/imgs/tennis.png" alt="MatchGame" onClick={() => {navigate('/game/tennis')}} />
      </div>
      <div className="style-mode">
          <span>Mode <br/>Akinator</span>
          <img src='/src/imgs/akinator.png' alt="Akinator" onClick={() => {navigate('/game/akinator')}} />
      </div>
    </div>
  );
}






// import './HomeGame.css';
// import { Link, useNavigate } from 'react-router-dom';

// // import { newRoomRef } from './match';
// // export const RoomRef = newRoomRef;



// export default function HomeGame() {

//   const navigate = useNavigate();

//   return (
//     <div className="GameHome">
//       <div className="PongClassic">
//         <span>Classic</span>
//           <img  src='' alt="Classic" onClick={() => {navigate('/game/classic')}} />
//       </div>
//       <div className="PongTennis">
//         <span>Tennis</span>
//           <img  src="" alt="MatchGame" onClick={() => {navigate('/game/tennis')}} />
//       </div>
//       <div className="Akinator">
//           Akinator
//           <img src='src/imgs/akinator.png' alt="Akinator" onClick={() => {navigate('/game/akinator')}} />
//       </div>
//     </div>
//   );
// }

