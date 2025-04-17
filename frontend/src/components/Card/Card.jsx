import "./Card.css";

export const Card = ({
  plant,
  onClick,
  setOpeningHand,
  isTwoCardsChoice,
  isCardInPlay,
  selectStat
}) => {
  const onStatContainerClick = (event) => {
    console.log("On stat container click")
    selectStat(event.target.dataset["stat"])
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
        data-stat="year"
        onClick={((event) =>{
          if (isCardInPlay) {
            onStatContainerClick(event)
          }
        })}
      >
        <p data-testid="year-text">{plant.year}</p>
      </div>
      <div
        className="edible-container"
        data-stat="edible"
        onClick={((event) =>{
          if (isCardInPlay) {
            onStatContainerClick(event)
          }
        })}
      >
        <p data-testid="edible-text">{plant.edible ? "Yes" : "No"}</p>
        
      </div>
      <div
        className="average-ph-container"
        data-stat="ph_levels.ph_range"
        onClick={((event) =>{
          if (isCardInPlay) {
            onStatContainerClick(event)
          }
        })}
      >
        <p data-testid="average-ph-text">{plant.ph_levels.ph_range}</p>
      </div>
      <div
        className="light-container"
        data-stat="light"
        onClick={((event) =>{
          if (isCardInPlay) {
            onStatContainerClick(event)
          }
        })}
      >
        <p data-testid="light-text">{plant.light}</p>
      </div>
      <div
        className="nutrients-container"
        data-stat="soil_nutriments"
        onClick={((event) =>{
          if (isCardInPlay) {
            onStatContainerClick(event)
          }
        })}
      >
        <p data-testid="nutrients-text">{plant.soil_nutriments}</p>
      </div>
      <div
        className="water-required-container"
        data-stat="atmospheric_humidity"
        onClick={((event) =>{
          if (isCardInPlay) {
            onStatContainerClick(event)
          }
        })}
      >
        <p data-testid="water-text">{plant.atmospheric_humidity}</p>
      </div>
    </article>
  );
};
