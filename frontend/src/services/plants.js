// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getPlants = async (token) => {
    const requestOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetch(`${BACKEND_URL}/plants`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to fetch plants");
    }

    const data = await response.json();

    // data.data
    return { data: data.data, token: data.token };
};

export const postPlantForComparison = async (
    player_card_id,
    opponent_card_id,
    stat_to_compare,
    token
) => {
    const cardData = {
        player_card: player_card_id,
        opponent_card: opponent_card_id,
        stat_to_compare: stat_to_compare,
    };

    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
    };

    const response = await fetch(`${BACKEND_URL}/plants`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to send cards to compare");
    }
    const jsonResponse = await response.json();
    // jsonResponse.winner

    return {
        winner: jsonResponse.winner,
        token: jsonResponse.token,
        compared_stat: jsonResponse.compared_stat,
    };
};
