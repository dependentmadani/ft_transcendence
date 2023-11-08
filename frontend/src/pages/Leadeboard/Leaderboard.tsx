import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import './Leaderboard.css';

interface User {
    id: number;
    avatar: string;
    username: string;
    gamesPlayed: number;
    wins: number;
    rank: number;
    userStatus: string;
}

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
            const response = await axios.get(`http://localhost:8000/game/leaderboard`, {withCredentials: true});
            setAkinatorUser(response.data.find(user => user.username === "akinator"));
            setAkinatorRank(response.data.findIndex(user => user.username === "akinator"));
            console.log("akinator  ---> ", akinatorUser);
            setLeaderboard(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
            setLoading(true);
        }
    };

    useEffect(() => {
        console.log(`leaderboard : ${leaderboard[0]}`)

    }, [leaderboard]) 

    const navigate = useNavigate();
    const goProfile = (username : string) => { navigate(`/profile/${username}`) }

    const userLeaderboard  = ( ) => {
        return (
            leaderboard.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase())).map((user, index) => {
                if (user.username === "akinator")
                    return ;
                return (
                    <div key={user.id} className="player-stats" key={user.id}>
                        <div className={(user.userStatus === "OFFLINE")? "img-frame offline" : "img-frame online" } > 
                            <img src={user.avatar} alt="User image" onError={(e) => { e.target.src = '/src/imgs/user-img.png'; }} 
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

    // console.log('----- : ', userLeaderboard())

    return (
        <div className="leaderboard-section">
            <div className="leaderboard-heading">
                <h2>Leaderboard</h2>
                <input
                    type="text"
                    placeholder="Search by username"
                    value={searchQuery}
                    onChange={(e) => {setSearchQuery(e.target.value); console.log("Search For: ", searchQuery); }}
                />
            </div>
            { akinatorUser && (
                <div className="player-stats akinator-bot" key={akinatorUser.id}>
                    <div className={(akinatorUser.userStatus === "OFFLINE")? "img-frame offline" : "img-frame online" } > 
                        <img src={akinatorUser.avatar} alt="User image" onError={(e) => { e.target.src = '/src/imgs/user-img.png'; }} />
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
                <img id='Loding' src='/src/imgs/svg/eat.svg' />
            ) : userLeaderboard().length ? userLeaderboard() : <span className='no-users'> No Users .... </span>} 
        </div>
    );
}

export default Leaderboard;