import "./Card.css";

export const Card = ({
  plant,
  onClick,
  setOpeningHand,
  setStatInPlay,
  setPlayerStatValue,
  setOpponentStatValue,
  owner,
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
        data-stat="plant.average-ph"
        onClick={onStatContainerClick}
      >
        <p data-testid="average-ph-text">{plant.average_pH}</p>
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
        data-stat="plant.nutrients-required"
        onClick={onStatContainerClick}
      >
        <p data-testid="nutrients-text">{plant.nutrients_required}</p>
      </div>
      <div
        className="water-required-container"
        data-stat="plant.water-required"
        onClick={onStatContainerClick}
      >
        <p data-testid="water-text">{plant.water_required}</p>
      </div>
    </article>
  );
};
