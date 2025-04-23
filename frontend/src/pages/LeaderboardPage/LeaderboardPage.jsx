import { useEffect, useState } from "react";
import LeaderboardTable from "../../components/LeaderboardTable/LeaderboardTable";
import { getRankings } from "../../services/userStats";

export const LeaderboardPage = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    getRankings().then((response) => {
      setStats(response);
    });
  }, []);

  return (
    <div>
      <h1>Leaderboard table</h1>
      <LeaderboardTable stats={stats}></LeaderboardTable>
    </div>
  );
};
