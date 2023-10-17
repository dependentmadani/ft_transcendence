import './navBarTree.css'
import { useNavigate } from 'react-router-dom';


function NavBarTree () {

    const navigate = useNavigate()

    const goToHome = () => { navigate('/') }

    const goToProfile = () => { navigate('/profile') }

    const goToPlay = () => { navigate('/play') }

    const goToChat = () => { navigate('/chat') }

    const goToLeader = () => { navigate('/leaderboard') }

    return (
        <>
            <img src="src/imgs/home-icon.png" alt="home" onClick={goToHome}/>
            <img src="src/imgs/account-icon.png" alt="profile" onClick={goToProfile}/>
            <img src="src/imgs/chat-icon.png" alt="chat" onClick={goToChat}/>
            <img src="src/imgs/racket-icon.png" alt="play" onClick={goToPlay}/>
            <img src="src/imgs/leaderboard.png" alt="leaderboard" onClick={goToLeader}/>
        </>
    )
}

export default NavBarTree;