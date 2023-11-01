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
}

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                leaderboard.map(user => {
                    return (
                        <div className="player-stats" key={user.id}>
                            <div className="img-frame online">
                                <img src={user.avatar} alt="User image" />
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
                            <div className="rank">
                                <span>{user.rank}#</span>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default Leaderboard;