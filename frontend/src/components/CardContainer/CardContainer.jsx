import { Card } from "../Card/Card";

export const CardContainer = ({ plants }) => {
    return (
        <div className="cards-container">
            {plants.map((plant) => (
                <Card key={plant.id} plant={plant} />
            ))}
        </div>
    );
};
