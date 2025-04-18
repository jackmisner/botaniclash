import { CardContainer } from "../../components/CardContainer/CardContainer";
import { useState } from "react";
import { postPlantForComparison } from "../../services/plants";
import { useLocation } from "react-router-dom";
import "./PlayGamePage.css";
import { DeckInHand } from "../../components/DeckInHand/DeckInHand";

export const PlayGamePage = () => {
    const location = useLocation();
    const { startingPlayerHand, startingOpponentHand } = location.state || {
        startingPlayerHand: [],
        startingOpponentHand: [],
    };
    const [playerHand, setPlayerHand] = useState(startingPlayerHand); // should be getting passed from GameSetupPage
    const [opponentHand, setOpponentHand] = useState(startingOpponentHand); // should be getting passed from GameSetupPage
    const [cardsInPlay, setCardsInPlay] = useState([]); // top cards from both opponent and player
    const [gameWinner, setGameWinner] = useState("");
    console.log("opponentHand:", opponentHand);
    console.log("playerHand:", playerHand);

    const selectStat = (stat) => {
        postPlantForComparison(cardsInPlay[0].id, cardsInPlay[1].id, stat).then(
            (response) => {
                if (response === "player") {
                    playerOneWinsComparison();
                } else if (response === "opponent") {
                    playerTwoWinsComparison();
                } else if (response === "draw") {
                    drawOutcome();
                }
            }
        );
    };

    const pickTopCards = () => {
        setCardsInPlay([playerHand[0], opponentHand[0]]);
        setPlayerHand((prev) => prev.slice(1)); // remove the first card
        setOpponentHand((prev) => prev.slice(1)); // remove the first card
    };
    const playerOneWinsComparison = () => {
        opponentHand.length === 0 && setGameWinner("Player1");
        setPlayerHand((prev) => {
            const updatedCards = cardsInPlay.map((card) => ({
                ...card,
                owner: " player",
            }));
            setCardsInPlay([]);
            return [...prev, ...updatedCards];
        });
    };
    const playerTwoWinsComparison = () => {
        playerHand.length === 0 && setGameWinner("Player2");
        setOpponentHand((prev) => {
            const updatedCards = cardsInPlay.map((card) => ({
                ...card,
                owner: " opponent",
            }));
            setCardsInPlay([]);
            return [...prev, ...updatedCards];
        });
    };

    const drawOutcome = () => {
        setPlayerHand((prev) => {
            return [...prev, cardsInPlay[0]];
        });
        setOpponentHand((prev) => {
            return [...prev, cardsInPlay[1]];
        });
        setCardsInPlay([]);
    };

    return (
        <>
            {gameWinner && <h1>Winner --- {gameWinner}</h1>}
            {playerHand.length > 0 &&
                opponentHand.length > 0 &&
                cardsInPlay.length == 0 && (
                    <button
                        onClick={pickTopCards}
                        className="next-round-button"
                    >
                        Next Round
                    </button>
                )}
            {cardsInPlay.length > 0 && <h1>Cards in Play</h1>}
            {cardsInPlay.length > 0 && (
                <CardContainer
                    plants={cardsInPlay}
                    isCardInPlay={true}
                    selectStat={selectStat}
                />
            )}
            <div className="decks-in-hand-container">
                {playerHand && playerHand.length > 0 && (
                    <div className="deck-cards">
                        <h1>Your Hand</h1>
                        <DeckInHand plants={playerHand} />
                    </div>
                )}
                {opponentHand && opponentHand.length > 0 && (
                    <div className="deck-cards">
                        <h1>Opponent Hand</h1>
                        <DeckInHand plants={opponentHand} />
                    </div>
                )}
            </div>
        </>
    );
};
