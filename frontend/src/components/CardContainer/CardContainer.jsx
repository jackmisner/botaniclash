import { Card } from "../Card/Card";

export const CardContainer = () => {
  const mockPlants = [
    {
      id: 1,
      common_name: "Common Dandelion",
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
      common_name: "Walnut Tree",
      scientific_name: "Treeus Walnutus",
      image_url:
        "https://bs.plantnet.org/image/o/17d00178e56cefcd5607668824c7a52f5b3a831a",
      year: "1462",
      edible: "Yes",
      light: "4",
      growth_rate: "Medium",
      nitrogen_fixation: null,
      average_height: "75",
    },
  ];
  return (
    <div className="cards-container">
      {mockPlants.map((plant) => (
        <Card key={plant.id} plant={plant} />
      ))}
    </div>
  );
};
