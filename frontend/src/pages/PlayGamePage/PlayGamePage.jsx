import { CardContainer } from "../../components/CardContainer/CardContainer";
import { useState, useEffect } from "react";
import { postPlantForComparison } from "../../services/plants";
import { useLocation } from "react-router-dom";
import "./PlayGamePage.css";
import { DeckInHand } from "../../components/DeckInHand/DeckInHand";
import { preloadPlantImages } from "../../services/imagePreloader";
import lightBulbOn from "../../assets/light-bulb-on.png"
import lightBulbOff from "../../assets/light-bulb-off.png"

export const PlayGamePage = () => {
    const location = useLocation();
    const { startingPlayerHand, startingOpponentHand } = location.state || {
        startingPlayerHand: [],
        startingOpponentHand: [],
    };
    const [playerHand, setPlayerHand] = useState(startingPlayerHand);
    const [opponentHand, setOpponentHand] = useState(startingOpponentHand);
    const [cardsInPlay, setCardsInPlay] = useState([]);
    const [gameWinner, setGameWinner] = useState("");
    const [opponentCardShow, setOpponentCardShow] = useState(true);
    const [isPlayersTurn, setIsPlayersTurn] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [hintsOn, setHintsOn] = useState(true);

    const toggleHints = () => {
      setHintsOn(!hintsOn);

    }

    // Preload all images when the component mounts
    useEffect(() => {
        const loadAllImages = async () => {
            setIsLoading(true);

            // Combine all cards
            const allCards = [...playerHand, ...opponentHand];

            // Preload all images
            await preloadPlantImages(allCards, (loaded, total) => {
                setLoadingProgress(Math.floor((loaded / total) * 100));
            });

            setIsLoading(false);
        };

        loadAllImages();
    }, []);

    // Pre-cache the next cards to be played
    useEffect(() => {
        const preloadNextCards = async () => {
            if (
                playerHand.length > 0 &&
                opponentHand.length > 0 &&
                !isLoading
            ) {
                // Preload the next cards in each deck
                await preloadPlantImages([playerHand[0], opponentHand[0]]);
            }
        };

        preloadNextCards();
    }, [playerHand, opponentHand, isLoading]);

    const selectStat = (
        stat,
        card1 = cardsInPlay[0],
        card2 = cardsInPlay[1]
    ) => {
        setOpponentCardShow(true);
        const token = localStorage.getItem("token");
        setTimeout(() => {
            postPlantForComparison(card1.id, card2.id, stat, token).then(
                (response) => {
                    if (response.winner === "player") {
                        playerOneWinsComparison([card1, card2]);
                        alert("You won - compared stat: " + stat);
                    } else if (response.winner === "opponent") {
                        playerTwoWinsComparison([card1, card2]);
                        alert("Opponent won - compared stat: " + stat);
                    } else if (response.winner === "draw") {
                        drawOutcome([card1, card2]);
                        alert("Draw - compared stat: " + stat);
                    }
                    // set a new token
                    localStorage.setItem("token", response.token);
                }
            );
        }, 1000);
    };

    const onClickNextRoundHandle = () => {
        if (isPlayersTurn) {
            setOpponentCardShow(false);
        }
        setIsPlayersTurn((prev) => !prev);
    };

    // const selectRandomStat = (latestCardsInPlay) => {
    //   // Select random stat - computer turn
    //   if (!isPlayersTurn) {
    //     const POSSIBLE_STATS = [
    //       "year",
    //       "edible",
    //       "ph_range",
    //       "light",
    //       "soil_nutriments",
    //       "atmospheric_humidity",
    //     ];
    //     const randomStat =
    //       POSSIBLE_STATS[Math.floor(Math.random() * POSSIBLE_STATS.length)];
    //     selectStat(randomStat, latestCardsInPlay[0], latestCardsInPlay[1]);
    //   }
    // };

    const pickTopCards = async () => {
        if (playerHand.length === 0 || opponentHand.length === 0) return;

        const latestCardsInPlay = [playerHand[0], opponentHand[0]];

        // Ensure these cards' images are loaded before displaying them
        await preloadPlantImages(latestCardsInPlay);

        setCardsInPlay(latestCardsInPlay);
        setPlayerHand((prev) => prev.slice(1));
        setOpponentHand((prev) => prev.slice(1));

        // Select random stat - computer turn
        // selectRandomStat(latestCardsInPlay);
        if (!isPlayersTurn) {
            selectStat(null, latestCardsInPlay[0], latestCardsInPlay[1]);
        }
    };

    const playerOneWinsComparison = (cards) => {
        if (opponentHand.length === 0) setGameWinner("Player1");

        setPlayerHand((prev) => {
            const updatedCards = cards.map((card) => ({
                ...card,
                owner: "player",
            }));
            setCardsInPlay([]);
            return [...prev, ...updatedCards];
        });
    };

    const playerTwoWinsComparison = (cards) => {
        if (playerHand.length === 0) setGameWinner("Player2");

        setOpponentHand((prev) => {
            const updatedCards = cards.map((card) => ({
                ...card,
                owner: "opponent",
            }));
            setCardsInPlay([]);
            return [...prev, ...updatedCards];
        });
    };

    const drawOutcome = (cards) => {
        setPlayerHand((prev) => [...prev, cards[0]]);
        setOpponentHand((prev) => [...prev, cards[1]]);
        setCardsInPlay([]);
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <h2>Preparing Game...</h2>
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${loadingProgress}%` }}
                    ></div>
                </div>
                <p>{loadingProgress}% complete</p>
            </div>
        );
    }

    return (
        <div className="background-image">
        <div className="hints-button-container" onClick={toggleHints}>
          <img src={hintsOn? lightBulbOn : lightBulbOff}></img>
        </div>
            {gameWinner && <h1>Winner --- {gameWinner}</h1>}
            {playerHand.length > 0 &&
                opponentHand.length > 0 &&
                cardsInPlay.length === 0 && (
                    <button
                        onClick={() => {
                            pickTopCards();
                            onClickNextRoundHandle();
                        }}
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
                    opponentCardShow={opponentCardShow}
                    selectStat={selectStat}
                    hints={hintsOn}
                />
            )}
            <div className="decks-in-hand-container">
                {playerHand && playerHand.length > 0 && (
                    <div className="deck-cards">
                        <h1>Player Hand</h1>
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
        </div>
    );
};
