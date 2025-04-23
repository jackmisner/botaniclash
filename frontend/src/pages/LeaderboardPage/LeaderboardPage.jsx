import LeaderboardTable from "../../components/LeaderboardTable/LeaderboardTable";

export const LeaderboardPage = () => {
  const stats = [
    {
      Username: "Michal",
      GamesPlayed: 14,
      GamesWon: 9,
    },
    {
      Username: "Jack",
      GamesPlayed: 22,
      GamesWon: 16,
    },
    {
      Username: "Alec",
      GamesPlayed: 19,
      GamesWon: 14,
    },
    {
      Username: "Imogen",
      GamesPlayed: 8,
      GamesWon: 4,
    },
    {
      Username: "Abbie",
      GamesPlayed: 10,
      GamesWon: 7,
    },
    {
      Username: "Luke",
      GamesPlayed: 17,
      GamesWon: 10,
    },
    {
      Username: "Will",
      GamesPlayed: 3,
      GamesWon: 1,
    },
  ];
  return (
    <div>
      <h1>Leaderboard table</h1>
      <LeaderboardTable stats={stats}></LeaderboardTable>
    </div>
  );
};
