/**
 * A component that displays cards in the player's hand
 * @component
 * @param {Object} props - The component props
 * @param {Array} props.plants - Array of plant cards to be displayed in hand
 * @returns {JSX.Element} A container div with card images representing the player's hand
 */

import cardBackImage from "../../assets/card-back.png";
import "./DeckInHand.css";

export const DeckInHand = ({ plants }) => {
  return (
    <div className="cards-in-hand-container">
      {plants.map((plant, index) => {
        return (
          <div className="card-in-hand" key={index}>
            <img src={cardBackImage} width="200px" height="250px" />
          </div>
        );
      })}
    </div>
  );
};
