/**
 * A React component that implements the main game play interface.
 *
 * @component
 * @description
 * Manages the game state including player hands, cards in play, turns, and game winner.
 * Handles card comparison logic, turn switching, and image preloading for smooth gameplay.
 *
 * @example
 * return (
 *   <PlayGamePage />
 * )
 *
 * @requires {Component} CardContainer - Component for displaying cards in play
 * @requires {Component} DeckInHand - Component for displaying player's deck
 * @requires {Function} postPlantForComparison - API service for comparing plants
 * @requires {Function} preloadPlantImages - Utility for preloading plant images
 *
 * @state {Array} playerHand - Current cards in player's hand
 * @state {Array} opponentHand - Current cards in opponent's hand
 * @state {Array} cardsInPlay - Cards currently being compared
 * @state {string} gameWinner - Stores the winner of the game
 * @state {boolean} opponentCardShow - Controls visibility of opponent's card
 * @state {boolean} isPlayersTurn - Tracks whose turn it is
 * @state {boolean} isLoading - Indicates if assets are still loading
 * @state {number} loadingProgress - Tracks image loading progress
 * @state {boolean} hintsOn - Controls visibility of gameplay hints
 *
 * @returns {JSX.Element} A game interface with card comparison and deck management
 */

import { CardContainer } from "../../components/CardContainer/CardContainer";
import { useState, useEffect } from "react";
import { postPlantForComparison } from "../../services/plants";
import { Link, useLocation } from "react-router-dom";
import "./PlayGamePage.css";
import { DeckInHand } from "../../components/DeckInHand/DeckInHand";
import { preloadPlantImages } from "../../services/imagePreloader";
import lightBulbOn from "../../assets/light-bulb-on.png";
import lightBulbOff from "../../assets/light-bulb-off.png";
import { postWinner } from "../../services/userStats";
import { RoundWinner } from "../../components/RoundWinner/RoundWinner";
import cardFlipSound from "../../assets/soundFX/show-card.mp3";
import loseGameSound from "../../assets/soundFX/lose-game-sound.mp3";
import winGameSound from "../../assets/soundFX/win-game-sound.mp3";

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
    const [roundWinner, setRoundWinner] = useState();

    useEffect(() => {
        if (gameWinner && localStorage.getItem("sound") === "true") {
            const sound =
                gameWinner === "Player" ? winGameSound : loseGameSound;
            const audio = new Audio(sound);
            audio.play();
        }
    }, [gameWinner]);
    

    const ORIGINAL_STATS_NAMES = {
        year: "Discovery published in",
        edible: "edible",
        ph_range: "Soil pH range",
        light: "Light Level",
        soil_nutriments: "Nutrients required",
        atmospheric_humidity: "Humidity Level",
    };

    const toggleHints = () => {
        setHintsOn(!hintsOn);
    };

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

                        setRoundWinner([
                            "Player wins stat compared: ",
                            ORIGINAL_STATS_NAMES[response.compared_stat],
                        ]);
                    } else if (response.winner === "opponent") {
                        playerTwoWinsComparison([card1, card2]);
                        setRoundWinner([
                            "Opponent wins stat compared: ",
                            ORIGINAL_STATS_NAMES[response.compared_stat],
                        ]);
                    } else if (response.winner === "draw") {
                        drawOutcome([card1, card2]);
                        setRoundWinner([
                            "Draw stat compared: ",
                            ORIGINAL_STATS_NAMES[response.compared_stat],
                        ]);
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
        setRoundWinner();
        setCardsInPlay([]);
    };

    const pickTopCards = async () => {
        if (playerHand.length === 0 || opponentHand.length === 0) return;

        const latestCardsInPlay = [playerHand[0], opponentHand[0]];

        // Ensure these cards' images are loaded before displaying them
        await preloadPlantImages(latestCardsInPlay);

        setCardsInPlay(latestCardsInPlay);
        setPlayerHand((prev) => prev.slice(1));
        setOpponentHand((prev) => prev.slice(1));

        if (!isPlayersTurn) {
            selectStat(null, latestCardsInPlay[0], latestCardsInPlay[1]);
            if (localStorage.getItem("sound") === "true") 
                {const audio = new Audio(cardFlipSound);
            audio.play();}
        }
    };

    const playerOneWinsComparison = (cards) => {
        const token = localStorage.getItem("token");
        if (opponentHand.length === 0) {
            setGameWinner("Player");
            postWinner(token, "player");
        }

        setPlayerHand((prev) => {
            const updatedCards = cards.map((card) => ({
                ...card,
                owner: "player",
            }));

            return [...prev, ...updatedCards];
        });
    };

    const playerTwoWinsComparison = (cards) => {
        const token = localStorage.getItem("token");

        if (playerHand.length === 0) {
            setGameWinner("Opponent");
            postWinner(token, "opponent");
        }

        setOpponentHand((prev) => {
            const updatedCards = cards.map((card) => ({
                ...card,
                owner: "opponent",
            }));

            return [...prev, ...updatedCards];
        });
    };

    const drawOutcome = (cards) => {
        setPlayerHand((prev) => [...prev, cards[0]]);
        setOpponentHand((prev) => [...prev, cards[1]]);
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

    return gameWinner ? (
        <>
            <h1>{gameWinner} wins!</h1>
            <Link to="/setupgame" className="new-game-link">
                New Game?
            </Link>
            <CardContainer
                plants={gameWinner === "Player" ? playerHand : opponentHand}
                opponentCardShow={true}
            ></CardContainer>
        </>
    ) : (
        <>
            <div className="round-winner-container">
                {roundWinner && <RoundWinner roundWinner={roundWinner} />}
                {((playerHand.length === 5 && opponentHand.length === 5) ||
                    roundWinner) && (
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
            </div>
            <div className="background-image">
                <div className="hints-button-container" onClick={toggleHints}>
                    <img src={hintsOn ? lightBulbOn : lightBulbOff}></img>
                </div>

                {(cardsInPlay.length > 0 || gameWinner) && (
                    <h1>Cards in Play</h1>
                )}
                {(cardsInPlay.length > 0 || gameWinner) && (
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
        </>
    );
};
