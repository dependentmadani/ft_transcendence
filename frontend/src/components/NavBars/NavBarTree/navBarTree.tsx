import { useUrl } from '@/context/UrlContext';
import './navBarTree.css'
import { useNavigate } from 'react-router-dom';
import { useStart } from '@/context/startContext';



function NavBarTree () {

    const navigate = useNavigate()
    const [, setMyUrl] = useUrl();
    const [start] = useStart();


    const goToHome = () => { 
        navigate('/');
        if (start)  setMyUrl(true);
    }

    const goToProfile = () => { 
        navigate('/profile');
        if (start)  setMyUrl(true);
    }

    const goToPlay = () => { 
        navigate('/game');
        if (start)  setMyUrl(true);
    }

    const goToChat = () => { 
        navigate('/chat');
        if (start)  setMyUrl(true);
    }

    const goToLeader = () => { 
        navigate('/leaderboard');
        if (start)  setMyUrl(true);
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