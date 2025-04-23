import LeaderboardTable from "../../components/LeaderboardTable/LeaderboardTable";

export const LeaderboardPage = () => {
    const stats = [{
        UserId: 1,
        Username: "Michal",
        GamesPlayed: 3,
        GamesWon: 1
    },
    {
        UserId: 2,
        Username: "Jack",
        GamesPlayed: 2,
        GamesWon: 1
    }, {
        UserId: 3,
        Username: "Alec",
        GamesPlayed: 6,
        GamesWon: 0
    }, {
        UserId: 4,
        Username: "Luke",
        GamesPlayed: 20,
        GamesWon: 19
    }]
    return (
        <div>
        <h1>Leaderboard table</h1>
        <LeaderboardTable stats={stats}></LeaderboardTable>
        </div>
    )
}