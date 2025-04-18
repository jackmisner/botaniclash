import { Card } from "../Card/Card";

export const CardContainer = ({
    plants,
    onClickHandle,
    setOpeningHand,
    setPlayerStatValue,
    setOpponentStatValue,
    isTwoCardsChoice = false,
    isCardInPlay = false,
    selectStat,
    opponentCardShow,
}) => {
    return (
        <div data-testid="cards-container" className="cards-container">
            {plants.length > 0 &&
                plants.map((plant) => (
                    <Card
                        setPlayerStatValue={setPlayerStatValue}
                        setOpponentStatValue={setOpponentStatValue}
                        setOpeningHand={setOpeningHand}
                        onClick={onClickHandle}
                        key={plant.id}
                        plant={plant}
                        isTwoCardsChoice={isTwoCardsChoice}
                        isCardInPlay={isCardInPlay}
                        selectStat={selectStat}
                        opponentCardShow={opponentCardShow}
                    />
                ))}
        </div>
    );
};
