import { useUrl } from '@/context/UrlContext';
import './navBarTree.css'
import { useNavigate } from 'react-router-dom';


function NavBarTree () {

    const navigate = useNavigate()
    const [, setMyUrl] = useUrl();



    const goToHome = () => { 
        navigate('/');
         setMyUrl(true);
    }

    const goToProfile = () => { 
        navigate('/profile');
         setMyUrl(true);
    }

    const goToPlay = () => { 
        navigate('/game');
         setMyUrl(true);
    }

    const goToChat = () => { 
        navigate('/chat');
         setMyUrl(true);
    }

    const goToLeader = () => { 
        navigate('/leaderboard');
         setMyUrl(true);
    }

    return (
        <>
            <img src="/src/imgs/home-icon.png" alt="home" onClick={goToHome}/>
            <img src="/src/imgs/account-icon.png" alt="profile" onClick={goToProfile}/>
            <img src="/src/imgs/chat-icon.png" alt="chat" onClick={goToChat}/>
            <img src="/src/imgs/racket-icon.png" alt="game" onClick={goToPlay}/>
            <img src="/src/imgs/leaderboard.png" alt="leaderboard" onClick={goToLeader}/>
        </>
    )
}

export default NavBarTree;