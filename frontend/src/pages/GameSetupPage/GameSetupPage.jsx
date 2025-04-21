import { useEffect, useState } from "react";
import { CardContainer } from "../../components/CardContainer/CardContainer";
import { Link } from "react-router-dom";
import { getPlants } from "../../services/plants";
import { prefetchPlantImages } from "../../services/imagePrefetcher";
import "./GameSetupPage.css";

export const GameSetupPage = () => {
  const [playerInitialTenCards, setPlayerInitialTenCards] = useState([]); // 10 cards array
  const [opponentHand, setOpponentHand] = useState([]); // 10 cards array
  const [twoCardsChoice, setTwoCardsChoice] = useState([]); // 2 cards array
  const [playerHand, setPlayerHand] = useState([]); // 5 cards array
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getPlants();
        const cards = data.cards;

        const shuffledCardsPlayer = cards.slice(0, 10).map((card) => ({
          ...card,
          owner: "player",
        })); // Assign owner to player cards

        const shuffledCardsOpponent = cards.slice(11, 16).map((card) => ({
          ...card,
          owner: "opponent",
        })); // Assign owner to opponent cards

        // Prefetch all plant images
        const allPlants = [...shuffledCardsPlayer, ...shuffledCardsOpponent];
        await prefetchPlantImages(allPlants, (loaded, total) => {
          setLoadingProgress(Math.floor((loaded / total) * 100));
        });

        setOpponentHand(shuffledCardsOpponent);
        const [first, second, ...rest] = shuffledCardsPlayer;
        setPlayerInitialTenCards(rest);
        setTwoCardsChoice([first, second]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching or processing plant data:", error);
        setIsLoading(false);
        // Optionally, you can set an error state to display an error message to the user
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
