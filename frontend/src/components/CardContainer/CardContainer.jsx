/**
 * A component that renders a container of plant cards.
 * @param {Object} props - The component props
 * @param {Array} props.plants - Array of plant objects to display as cards
 * @param {Function} props.onClickHandle - Click handler function for the cards
 * @param {Function} props.setOpeningHand - Function to set the opening hand of cards
 * @param {Function} props.setPlayerStatValue - Function to set the player's stat value
 * @param {Function} props.setOpponentStatValue - Function to set the opponent's stat value
 * @param {boolean} [props.isTwoCardsChoice=false] - Flag indicating if two cards can be chosen
 * @param {boolean} [props.isCardInPlay=false] - Flag indicating if the card is currently in play
 * @param {string} props.selectStat - The currently selected stat
 * @param {boolean} props.opponentCardShow - Flag indicating if opponent's card should be shown
 * @param {Array} props.cardsInPlay - Array of cards currently in play
 * @param {boolean} props.hints - Flag indicating if hints should be shown
 * @returns {JSX.Element} A container div with Card components
 */

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
  cardsInPlay,
  hints,
  isPlayersTurn,
  roundWinner,
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
            cardsInPlay={cardsInPlay}
            hints={hints}
            isPlayersTurn={isPlayersTurn}
            roundWinner={roundWinner}
          />
        ))}
    </div>
  );
};
