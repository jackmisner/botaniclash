import "./Card.css";

export const Card = ({ plant }) => {
    return (
        <article className="card">
            <p data-testid="common-name">{plant.common_name}</p>
            <p data-testid="scientific-name">{plant.scientific_name}</p>
            <img data-testid="image-url" src={plant.image_url} />
            <p data-testid="year">{plant.year}</p>
            <p data-testid="edible">{plant.edible}</p>
            <p data-testid="light">{plant.light}</p>
            <p data-testid="growth-rate">{plant.growth_rate}</p>
            <p data-testid="nitrogen">{plant.nitrogen_fixation}</p>
            <p data-testid="average-height">{plant.average_height}</p>
        </article>
    );
};
