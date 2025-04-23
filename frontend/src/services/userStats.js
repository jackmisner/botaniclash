const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getRankings = async () => {
    // const requestOptions = {
    //     method: "GET",
    //     headers: {
    //         // Authorization: `Bearer ${token}`,
    //     },
    // };

    // const response = await fetch(`${BACKEND_URL}/game_stats`, requestOptions);

    // if (response.status !== 200) {
    //     throw new Error("Unable to find users");
    // }

    // const data = await response.json();

    const data = [
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

    // data.data
    // return { data: data.data, token: data.token };
    return data;
};

export const postWinner = async (token, winner) => {
    const gameWinner = { winner: winner };
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(gameWinner),
    };
    console.log("winner", requestOptions);
    const response = await fetch(`${BACKEND_URL}/game_stats`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to post game winner");
    }

    return;
};
