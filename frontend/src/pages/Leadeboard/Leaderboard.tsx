import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import './Leaderboard.css';



function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [akinatorRank, setAkinatorRank] = useState<number>(0);
    const [akinatorUser, setAkinatorUser] = useState<User>();

    useEffect(() => {
        getLeaderboard();
    }, []);

    const getLeaderboard = async () => {
        try {
            const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/game/leaderboard`, {withCredentials: true});
            setAkinatorUser(response.data.find((user: { username: string }) => user.username === "akinator"));
            setAkinatorRank(response.data.findIndex((user: { username: string })=> user.username === "akinator"));
            setLeaderboard(response.data);
            setLoading(false);
        } catch (error) {
            // console.log("Error fetching leaderboard data:", error);
            setLoading(true);
        }
    };

    const navigate = useNavigate();
    const goProfile = (username : string) => { navigate(`/profile/${username}`) }

    const userLeaderboard  = ( ) => {
        return (
            leaderboard.filter((user:User) => user.username.toLowerCase().includes(searchQuery.toLowerCase())).map((user:User, index) => {
                if (user.username === "akinator")
                    return ;
                return (
                    <div key={user.id} className="player-stats">
                        <div className={(user.userStatus === "OFFLINE")? "img-frame offline" : "img-frame online" } > 
                            <img src={user.avatar} alt="User image" onError={(e) => { const target = e.target as HTMLImageElement
                                target.src = '/src/assets/imgs/user-img.png'; }} 
                                onClick={ () => goProfile(user.username) } />
                        </div>
                        <div className="status">
                            <span>{user.username}</span>
                        </div>
                        <div className="match-played">
                            <span>Match played: {user.games.gamesPlayed}</span>
                        </div>
                        <div className="wins">
                            <span>Wins: {user.games.wins}</span>
                        </div>
                        <div className="ratio">
                            <span>Ratio: {user.games.wins && user.games.gamesPlayed ? `${(100 * user.games.wins / user.games.gamesPlayed).toFixed(2)}%` : 'N/A'}</span>
                        </div>
                        <div className="leaderboard-rank">
                            <span>{++index}#</span>
                        </div>
                    </div> 
                )
            }
        ))
    } 


    return (
        <div className="leaderboard-section">
            <div className="leaderboard-heading">
                <h2>Leaderboard</h2>
                <input
                    type="text"
                    placeholder="Search by username"
                    value={searchQuery}
                    onChange={(e) => {setSearchQuery(e.target.value); }}
                />
            </div>
            { akinatorUser && (
                <div className="player-stats akinator-bot" key={akinatorUser.id}>
                    <div className={(akinatorUser.userStatus === "OFFLINE")? "img-frame offline" : "img-frame online" } > 
                        <img src={akinatorUser.avatar} alt="User image" onError={(e) => { const target = e.target as HTMLImageElement
                            target.src = '/src/assets/imgs/user-img.png'; }} />
                    </div>
                    <div className="status">
                        <span>{akinatorUser.username}</span>
                    </div>
                    <div className="match-played">
                        <span>Match played: {akinatorUser.games.gamesPlayed}</span>
                    </div>
                    <div className="wins">
                        <span>Wins: {akinatorUser.games.wins}</span>
                    </div>
                    <div className="ratio">
                        <span>Ratio: {akinatorUser.games.wins && akinatorUser.games.gamesPlayed ? `${(100 * akinatorUser.games.wins / akinatorUser.games.gamesPlayed).toFixed(2)}%` : 'N/A'}</span>
                    </div>
                    <div className="leaderboard-rank">
                        <span>{akinatorRank + 1}#</span>
                </div>
            </div> 
            )}
            {loading ? (
                <img id='Loding' src='/src/assets/imgs/svg/eat.svg' />
            ) : userLeaderboard().length ? userLeaderboard() : <span className='no-users'> No Users .... </span>} 
        </div>
    );
}

export default Leaderboard;