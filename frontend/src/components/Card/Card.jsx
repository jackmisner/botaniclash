import "./Card.css";

export const Card = ({ plant, onClick, setOpeningHand }) => {
  return (
    <article
      onClick={() => {
        onClick();
        setOpeningHand((prev) => {
          return [...prev, plant];
        });
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
      <p data-testid="year">{plant.year}</p>
      <p data-testid="edible">{plant.edible ? "Yes" : "No"}</p>
      <p data-testid="average-ph">{plant.average_pH}</p>
      <p data-testid="light">{plant.light}</p>
      <p data-testid="nutrients-required">{plant.nutrients_required}</p>
      <p data-testid="water-required">{plant.water_required}</p>
    </article>
  );
};
