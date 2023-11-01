import axios from "axios"
import { useEffect, useState } from "react"
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
    const [leaderboard, setLeaderboard] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        getLeaderboard();
    }, []);

    const getLeaderboard = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/users`, {withCredentials: true});
            setLeaderboard(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
            setLoading(true);
        }
    };

    const userLeaderboard  = ( ) => {
        return (
            leaderboard.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase())).map(user => {
                return (
                    <div className="player-stats" key={user.id}>
                        <div className={(user.userStatus === "OFFLINE")? "img-frame offline" : "img-frame online" } > 
                            <img src={user.avatar} alt="User image" onError={(e) => { e.target.src = '/src/imgs/user-img.png'; }} />
                        </div>
                        <div className="status">
                            <span>{user.username}</span>
                        </div>
                        <div className="match-played">
                            <span>Match played: {user.gamesPlayed}</span>
                        </div>
                        <div className="wins">
                            <span>Wins: {user.wins}</span>
                        </div>
                        <div className="ratio">
                            <span>Ratio: {user.wins && user.gamesPlayed ? `${(100 * user.wins / user.gamesPlayed).toFixed(2)}%` : 'N/A'}</span>
                        </div>
                        <div className="leaderboard-rank">
                            <span>{user.rank}#</span>
                        </div>
                    </div> 
                )
            }
        ))
    } 

    console.log('----- : ', userLeaderboard())

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
            {loading ? (
                <img id='Loding' src='/src/imgs/svg/eat.svg' />
            ) : userLeaderboard().length ? userLeaderboard() : <span id='no-users'> No Users .... </span>} 
        </div>
    );
}

export default Leaderboard;