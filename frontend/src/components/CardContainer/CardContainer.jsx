import { Card } from "../Card/Card";

export const CardContainer = ({
  plants,
  onClickHandle,
  setOpeningHand,
  setPlayerStatValue,
  setOpponentStatValue,
  owner,
  isTwoCardsChoice = false,
  cards_ids
}) => {
  return (
    <div data-testid="cards-container" className="cards-container">
      {plants.length > 0 &&
        plants.map((plant) => (
          <Card
            owner={owner}
            setPlayerStatValue={setPlayerStatValue}
            setOpponentStatValue={setOpponentStatValue}
            setOpeningHand={setOpeningHand}
            onClick={onClickHandle}
            key={plant.id}
            plant={plant}
            isTwoCardsChoice={isTwoCardsChoice}
            cards_ids={cards_ids}
          />
        ))}
    </div>
  );
};
