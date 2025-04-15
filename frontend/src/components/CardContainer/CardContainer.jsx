import { Card } from "../Card/Card";

export const CardContainer = ({ plants, onClickHandle, setOpeningHand }) => {
    return (
        <div className="cards-container">
            {plants.length > 0 &&
                plants.map((plant) => (
                    <Card
                        setOpeningHand={setOpeningHand}
                        onClick={onClickHandle}
                        key={plant.id}
                        plant={plant}
                    />
                ))}
        </div>
    );
};
