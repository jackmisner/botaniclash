import { useEffect } from "react";
import { CardContainer } from "../../components/CardContainer/CardContainer";
import { useState } from "react";
import { getPlants } from "../../services/plants";

export const PlayGamePage = () => {
  const [playerInitialTenCards, setPlayerInitialTenCards] = useState([]); // 10 cards array
  const [opponentHand, setOpponentHand] = useState([]); // 10 cards array
  const [twoCardsChoice, setTwoCardsChoice] = useState([]); // 2 cards array
  const [playerHand, setPlayerHand] = useState([]); // 5 cards array
  const [cardsInPlay, setCardsInPlay] = useState([]); // top cards from both opponent and player
  const [gameWinner, setGameWinner] = useState("");
  const [statInPlay, setStatInPlay] = useState("");

  useEffect(() => {
    getPlants().then((data) => {
      console.log("data:", data);
      const cards = data.cards;
      const shuffledCardsPlayer = cards.slice(0, 10).map((card) => ({
        ...card,
        owner: " player",
      })); // Assign owner to player cards
      const shuffledCardsOpponent = cards.slice(11, 16).map((card) => ({
        ...card,
        owner: " opponent",
      })); // Assign owner to opponent cards

      setOpponentHand(shuffledCardsOpponent);
      const [first, second, ...rest] = shuffledCardsPlayer;
      setPlayerInitialTenCards(rest);
      setTwoCardsChoice([first, second]);
    });
  }, []);

  useEffect(() => {
    console.log("statInPlay:", statInPlay);
  }, [statInPlay]);

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

  return (
    <>
      <h1 data-testid="play-game">Play game</h1>
      {gameWinner && <h1>Winner --- {gameWinner}</h1>}
      <button onClick={pickTopCards}>Test top cards</button>
      <button onClick={playerOneWinsComparison}>
        Player 1 wins comparison
      </button>
      <button onClick={playerTwoWinsComparison}>
        Player 2 wins comparison
      </button>
      {cardsInPlay.length > 0 && <h1>Cards in Play</h1>}
      {cardsInPlay.length > 0 && (
        <CardContainer plants={cardsInPlay} setStatInPlay={setStatInPlay} />
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

      {playerHand && playerHand.length > 0 && <h1>Opening hand</h1>}
      {playerHand && playerHand.length > 0 && (
        <CardContainer plants={playerHand} />
      )}
      <h1> Opponent hand</h1>
      <CardContainer plants={opponentHand} />
    </>
  );
};
