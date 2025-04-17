import "./Card.css";

export const Card = ({
  plant,
  onClick,
  setOpeningHand,
  setStatInPlay,
  isTwoCardsChoice,
}) => {
  const onStatContainerClick = (event) => {
    setStatInPlay(event.target.dataset["stat"]);
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
        onClick={onStatContainerClick}
      >
        <p data-testid="year-text">{plant.year}</p>
      </div>
      <div
        className="edible-container"
        data-stat="plant.edible"
        onClick={onStatContainerClick}
      >
        <p data-testid="edible-text">{plant.edible ? "Yes" : "No"}</p>
      </div>
      <div
        className="average-ph-container"
        data-stat="plant.ph_levels.ph_range"
        onClick={onStatContainerClick}
      >
        <p data-testid="average-ph-text">{plant.ph_levels.ph_range}</p>
      </div>
      <div
        className="light-container"
        data-stat="plant.light"
        onClick={onStatContainerClick}
      >
        <p data-testid="light-text">{plant.light}</p>
      </div>
      <div
        className="nutrients-container"
        data-stat="plant.soil_nutriments"
        onClick={onStatContainerClick}
      >
        <p data-testid="nutrients-text">{plant.soil_nutriments}</p>
      </div>
      <div
        className="water-required-container"
        data-stat="plant.atmospheric_humidity"
        onClick={onStatContainerClick}
      >
        <p data-testid="water-text">{plant.atmospheric_humidity}</p>
      </div>
    </article>
  );
};
