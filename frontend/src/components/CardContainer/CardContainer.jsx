import { Card } from "../Card/Card";

export const CardContainer = ({
  plants,
  onClickHandle,
  setOpeningHand,
  setStatInPlay,
  setPlayerStatValue,
  setOpponentStatValue,
  owner,
  isTwoCardsChoice = false, // New prop to indicate if this is the twoCardsChoice container
}) => {
  return (
    <div data-testid="cards-container" className="cards-container">
      {plants.length > 0 &&
        plants.map((plant) => (
          <Card
            owner={owner}
            setPlayerStatValue={setPlayerStatValue}
            setOpponentStatValue={setOpponentStatValue}
            setStatInPlay={setStatInPlay}
            setOpeningHand={setOpeningHand}
            onClick={onClickHandle}
            key={plant.id}
            plant={plant}
            isTwoCardsChoice={isTwoCardsChoice} // Pass the flag to the Card
          />
        ))}
    </div>
  );
};
