import { CardContainer } from "../../components/CardContainer/CardContainer";
import { useState, useEffect } from "react";
import { postPlantForComparison } from "../../services/plants";
import { useLocation } from "react-router-dom";
import "./PlayGamePage.css";
import { DeckInHand } from "../../components/DeckInHand/DeckInHand";
import { prefetchPlantImages } from "../../services/imagePrefetcher";

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
  const [opponentCardShow, setOpponentCardShow] = useState(true);
  const [isPlayersTurn, setIsPlayersTurn] = useState(true);
  const [imagesReady, setImagesReady] = useState(false);

  // Ensure images are in cache when the component mounts
  useEffect(() => {
    const ensureImagesAreCached = async () => {
      // Combine all cards that might be shown during the game
      const allCards = [...playerHand, ...opponentHand];

      // Re-prefetch to ensure all images are in cache
      // This is a quick operation if images are already cached
      await prefetchPlantImages(allCards);

      setImagesReady(true);
    };

    ensureImagesAreCached();
  }, [playerHand, opponentHand]);

  // Pre-fetch images for next cards that will be in play
  useEffect(() => {
    // If there are cards in both hands, prefetch the next cards that will be in play
    if (
      playerHand.length > 0 &&
      opponentHand.length > 0 &&
      cardsInPlay.length === 0
    ) {
      prefetchPlantImages([playerHand[0], opponentHand[0]]);
    }
  }, [playerHand, opponentHand, cardsInPlay]);

  const selectStat = (
    stat,
    card1 = cardsInPlay[0], // set default card, if function is not provided any value
    card2 = cardsInPlay[1], // set default card, if function is not provided any value
  ) => {
    setOpponentCardShow(true);
    setTimeout(() => {
      postPlantForComparison(card1.id, card2.id, stat).then((response) => {
        if (response === "player") {
          playerOneWinsComparison([card1, card2]);
          alert("You won - compared stat: " + stat);
        } else if (response === "opponent") {
          playerTwoWinsComparison([card1, card2]);
          alert("Opponent won - compared stat: " + stat);
        } else if (response === "draw") {
          drawOutcome([card1, card2]);
          alert("Draw - compared stat: " + stat);
        }
      });
    }, 1000);
  };

  const onClickNextRoundHandle = () => {
    if (isPlayersTurn) {
      setOpponentCardShow(false);
    }
    setIsPlayersTurn((prev) => !prev);
  };

  const selectRandomStat = (latestCardsInPlay) => {
    // Select random stat - computer turn
    if (!isPlayersTurn) {
      const POSSIBLE_STATS = [
        "year",
        "edible",
        "ph_range",
        "light",
        "soil_nutriments",
        "atmospheric_humidity",
      ];
      const randomStat =
        POSSIBLE_STATS[Math.floor(Math.random() * POSSIBLE_STATS.length)];
      selectStat(randomStat, latestCardsInPlay[0], latestCardsInPlay[1]);
    }
  };

  const pickTopCards = () => {
    const latestCardsInPlay = [playerHand[0], opponentHand[0]];
    setCardsInPlay(latestCardsInPlay);
    setPlayerHand((prev) => prev.slice(1)); // remove the first card
    setOpponentHand((prev) => prev.slice(1)); // remove the first card

    // Select random stat - computer turn
    selectRandomStat(latestCardsInPlay);
  };

  const playerOneWinsComparison = (cards) => {
    opponentHand.length === 0 && setGameWinner("Player1");
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
    playerHand.length === 0 && setGameWinner("Player2");
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
    setPlayerHand((prev) => {
      return [...prev, cards[0]];
    });
    setOpponentHand((prev) => {
      return [...prev, cards[1]];
    });
    setCardsInPlay([]);
  };

  if (!imagesReady) {
    return (
      <div className="loading-container">
        <h2>Preparing game...</h2>
      </div>
    );
  }

  return (
    <>
      {gameWinner && <h1>Winner --- {gameWinner}</h1>}
      {playerHand.length > 0 &&
        opponentHand.length > 0 &&
        cardsInPlay.length == 0 && (
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
    </>
  );
};
