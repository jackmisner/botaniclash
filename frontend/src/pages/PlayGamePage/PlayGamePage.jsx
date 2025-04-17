import { useEffect } from "react";
import { CardContainer } from "../../components/CardContainer/CardContainer";
import { useState } from "react";
import { getPlants, postPlantForComparison } from "../../services/plants";

export const PlayGamePage = () => {
  const [playerInitialTenCards, setPlayerInitialTenCards] = useState([]); // 10 cards array
  const [opponentHand, setOpponentHand] = useState([]); // 10 cards array
  const [twoCardsChoice, setTwoCardsChoice] = useState([]); // 2 cards array
  const [playerHand, setPlayerHand] = useState([]); // 5 cards array
  const [cardsInPlay, setCardsInPlay] = useState([]); // top cards from both opponent and player
  const [gameWinner, setGameWinner] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPlants();
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
      } catch (error) {
        console.error("Error fetching or processing plant data:", error);
        // Optionally, you can set an error state to display an error message to the user
      }
    };
    fetchData();
  }, []);

  const selectStat = (stat) => {
    postPlantForComparison(cardsInPlay[0].id, cardsInPlay[1].id, stat)
    .then((response) => {
      if (response === "player") {
        playerOneWinsComparison()
      } else if (response === "opponent") {
        playerTwoWinsComparison()
      } else if (response === "draw") {
        drawOutcome();
      }
    })
  };

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
    // const playerCardId = playerHand[0].id
    // const opponentCardId = opponentHand[0].id
    setPlayerHand((prev) => prev.slice(1)); // remove the first card
    setOpponentHand((prev) => prev.slice(1)); // remove the first card
    console.log("player hand", playerHand[0].id)
    console.log("opponent hand", opponentHand[0])
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
    })
    setOpponentHand((prev) => {
      return [...prev, cardsInPlay[1]];
    })
    setCardsInPlay([]);
  }

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
        <CardContainer plants={cardsInPlay} isCardInPlay={true} selectStat = {selectStat}/>
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
