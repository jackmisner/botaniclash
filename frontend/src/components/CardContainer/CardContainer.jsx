import { Card } from "../Card/Card";

export const CardContainer = () => {
    const mockPlants = [
        {
            id: 1,
            common_name: "common_plant_1",
            scientific_name: "scientific_plant_1",
            image_url:
                "https://bs.plantnet.org/image/o/17d00178e56cefcd5607668824c7a52f5b3a831a",
            year: "1990",
            edible: "Yes",
            light: "9",
            growth_rate: "Slow",
            nitrogen_fixation: null,
            average_height: "100",
        },
        {
            id: 2,
            common_name: "common_plant_2",
            scientific_name: "scientific_plant_2",
            image_url:
                "https://bs.plantnet.org/image/o/17d00178e56cefcd5607668824c7a52f5b3a831a",
            year: "1890",
            edible: "Yes",
            light: "8",
            growth_rate: "Medium",
            nitrogen_fixation: null,
            average_height: "75",
        },
    ];
    return mockPlants.map((plant) => <Card key={plant.id} plant={plant} />);
};
