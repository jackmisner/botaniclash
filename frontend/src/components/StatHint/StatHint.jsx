import "./StatHint.css";

export const StatHint = ({ stat }) => {
  const stats = {
    year: "Older discoveries beat newer ones",
    light:
      "A lower light stat is better because it means your plant needs less light to thrive",
    ph_range:
      "A higher ph stat is better because it means your plant can thrive in a greater range of soils",
    soil_nutriments:
      "A lower nutrient stat is better because it means your plant can thrive with fewer nutrients",
    atmospheric_humidity:
      "A lower humidity stat is better because it means your plant can thrive with less water",
    edible: "Edible plants beat non-edible plants",
  };

  return (
    <div className="stat-hint">
      <p>{stats[stat]}</p>
    </div>
  );
};
