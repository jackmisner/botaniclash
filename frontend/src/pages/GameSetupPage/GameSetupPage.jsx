import { useEffect, useState } from "react";
import { CardContainer } from "../../components/CardContainer/CardContainer";
import { Link } from "react-router-dom";
import { getPlants } from "../../services/plants";
import { preloadPlantImages } from "../../services/imagePreloader";
import "./GameSetupPage.css";

export const GameSetupPage = () => {
  const [playerInitialTenCards, setPlayerInitialTenCards] = useState([]);
  const [opponentHand, setOpponentHand] = useState([]);
  const [twoCardsChoice, setTwoCardsChoice] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Get plants from API
        const data = await getPlants(localStorage.getItem("token"));
        const cards = data.cards;

        // Prepare player and opponent hands
        const shuffledCardsPlayer = cards.slice(0, 10).map((card) => ({
          ...card,
          owner: "player",
        }));

        const shuffledCardsOpponent = cards.slice(11, 16).map((card) => ({
          ...card,
          owner: "opponent",
        }));

        // Preload all images before showing the cards
        const allPlants = [...shuffledCardsPlayer, ...shuffledCardsOpponent];

        await preloadPlantImages(allPlants, (loaded, total) => {
          setLoadingProgress(Math.floor((loaded / total) * 100));
        });

        // Now that images are preloaded, set the state
        setOpponentHand(shuffledCardsOpponent);
        const [first, second, ...rest] = shuffledCardsPlayer;
        setPlayerInitialTenCards(rest);
        setTwoCardsChoice([first, second]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching or processing plant data:", error);
        setError("Failed to load plants. Please try again.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const onClickHandle = () => {
    if (playerInitialTenCards.length > 1) {
      const [first, second, ...rest] = playerInitialTenCards;
      setPlayerInitialTenCards(rest);
      setTwoCardsChoice([first, second]);
    } else {
      // No more cards left, clear the twoCardsChoice array
      setTwoCardsChoice([]);
    }
  };

  const isInitialSelectionComplete =
    playerInitialTenCards.length === 0 && twoCardsChoice.length === 0;

  return (
    <>
      {isLoading ? (
        <div className="loading-container">
          <h2>Loading Plants...</h2>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p>{loadingProgress}% complete</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : (
        <>
          {isInitialSelectionComplete &&
            playerHand.length > 0 &&
            opponentHand.length > 0 && (
              <Link
                to="/playgame"
                className="nav-link"
                state={{
                  startingPlayerHand: playerHand,
                  startingOpponentHand: opponentHand,
                }}
              >
                Start Game
              </Link>
            )}

          {twoCardsChoice && twoCardsChoice.length > 0 && (
            <>
              <h1>Choose your opening hand</h1>
              <CardContainer
                onClickHandle={onClickHandle}
                setOpeningHand={setPlayerHand}
                plants={twoCardsChoice}
                isTwoCardsChoice={true}
              />
            </>
          )}

          {playerHand && playerHand.length > 0 && (
            <>
              <h1>Player Hand</h1>
              <CardContainer plants={playerHand} />
            </>
          )}
        </>
      )}
    </>
  );
};
