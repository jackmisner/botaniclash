import { useState, useEffect } from "react"
const LeaderboardTable = ({stats}) => {
    
    const [sortedData, setSortedData] = useState([])
    
    const totalScore = (GamesWon, GamesPlayed) => {
        if (GamesPlayed === 0) return "0%";
        return Math.round((GamesWon / GamesPlayed) * 100) + "%";
    };
    const totalLosses = (GamesWon, GamesPlayed) => {
        if (GamesPlayed === 0) return 0;
        return (GamesPlayed - GamesWon);
    };
    
    useEffect(() => {
        if (stats && stats.length > 0) {
          const sorted = [...stats].sort((a, b) => {
            const TotalScoreA = a.GamesPlayed > 0 ? a.GamesWon / a.GamesPlayed : 0;
            const TotalScoreB = b.GamesPlayed > 0 ? b.GamesWon / b.GamesPlayed : 0;
            return TotalScoreB - TotalScoreA;
          });
          setSortedData(sorted);
        }
      }, [stats]);


    return (
        <table className="leaderboard-table">
            <tr>
                <th>Ranking</th>
                <th>Username</th>
                <th>Games Played</th>
                <th>Games Won</th>
                <th>Games Lost</th>
                <th>Win/Loss Ratio</th>
            </tr>
            <tbody>
            {sortedData.map((player, index) => (
            <tr key={player.id}>
              <td className="rank-cell">{index + 1}</td>
              <td>{player.Username}</td>
              <td>{player.GamesPlayed}</td>
              <td>{player.GamesWon}</td>
              <td className="win-rate">{totalLosses(player.GamesWon, player.GamesPlayed)}</td>
              <td className="win-rate">{totalScore(player.GamesWon, player.GamesPlayed)}</td>
            </tr>
          ))}
        </tbody>
        </table>
    )
}

export default LeaderboardTable;