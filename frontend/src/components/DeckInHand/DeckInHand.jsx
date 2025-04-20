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
