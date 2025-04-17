import "./Card.css";
import { postPlantForComparison } from "../../services/plants";

export const Card = ({
  plant,
  onClick,
  setOpeningHand,
  isTwoCardsChoice,
  cards_ids
}) => {
  const onStatContainerClick = (event) => {
    const statInPlay = event.target.dataset["stat"];
    postPlantForComparison(cards_ids[0], cards_ids[1], statInPlay)
  };

  return (
    <article
      onClick={() => {
        if (isTwoCardsChoice) {
          // Only allow onClick if isTwoCardsChoice is true
          onClick();
          setOpeningHand((prev) => {
            return [...prev, plant];
          });
        }
      }}
      className="card"
    >
      <p data-testid="common-name">{plant.common_name}</p>
      <p data-testid="scientific-name">{plant.scientific_name}</p>
      <img
        data-testid="image-url"
        src={plant.image_url}
        alt={plant.common_name}
      />
      <div
        className="year-container"
        data-stat="plant.year"
        onClick={((event) =>{
          if (cards_ids && cards_ids.length > 0) {
            onStatContainerClick(event)
          }
        })}
      >
        <p data-testid="year-text">{plant.year}</p>
      </div>
      <div
        className="edible-container"
        data-stat="plant.edible"
        onClick={((event) =>{
          if (cards_ids && cards_ids.length > 0) {
            onStatContainerClick(event)
          }
        })}
      >
        <p data-testid="edible-text">{plant.edible ? "Yes" : "No"}</p>
        
      </div>
      <div
        className="average-ph-container"
        data-stat="plant.ph_levels.ph_range"
        onClick={((event) =>{
          if (cards_ids && cards_ids.length > 0) {
            onStatContainerClick(event)
          }
        })}
      >
        <p data-testid="average-ph-text">{plant.ph_levels.ph_range}</p>
      </div>
      <div
        className="light-container"
        data-stat="plant.light"
        onClick={((event) =>{
          if (cards_ids && cards_ids.length > 0) {
            onStatContainerClick(event)
          }
        })}
      >
        <p data-testid="light-text">{plant.light}</p>
      </div>
      <div
        className="nutrients-container"
        data-stat="plant.soil_nutriments"
        onClick={((event) =>{
          if (cards_ids && cards_ids.length > 0) {
            onStatContainerClick(event)
          }
        })}
      >
        <p data-testid="nutrients-text">{plant.soil_nutriments}</p>
      </div>
      <div
        className="water-required-container"
        data-stat="plant.atmospheric_humidity"
        onClick={((event) =>{
          if (cards_ids && cards_ids.length > 0) {
            onStatContainerClick(event)
          }
        })}
      >
        <p data-testid="water-text">{plant.atmospheric_humidity}</p>
      </div>
    </article>
  );
};
