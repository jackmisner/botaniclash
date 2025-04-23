/**
 * A component that renders a container for displaying and interacting with a card's statistics.
 *
 * @param {Object} props - The component props
 * @param {string} props.className - CSS class name for styling the container
 * @param {string} props.statName - Name of the statistic (e.g., "ph_range", "height")
 * @param {string|number} props.value - Value of the statistic to display
 * @param {boolean} props.isCardInPlay - Whether the card is currently in play and interactive
 * @param {Function} props.selectStat - Callback function when a stat is selected
 * @param {boolean} props.hints - Whether to show stat hints on hover
 * @param {Object} props.hoveredStats - Object tracking which stats are being hovered
 * @param {Function} props.onStatHover - Callback function when mouse enters the stat
 * @param {Function} props.onStatHoverLeave - Callback function when mouse leaves the stat
 * @returns {JSX.Element} A div containing the stat value and optional hint
 */

import "./Card.css";
import fallbackPlantImage from "../../assets/plant-fallback.png";
import cardBackImage from "../../assets/card-back.png";
import { getImageUrl } from "../../services/imagePreloader";
import { StatHint } from "../StatHint/StatHint";
import { useState } from "react";
import clickSound from "../../assets/soundFX/mouse-click.mp3"

// Helper component for stat containers
const StatContainer = ({
  className,
  statName,
  value,
  isCardInPlay,
  selectStat,
  hints,
  hoveredStats,
  onStatHover,
  onStatHoverLeave,
}) => {
  const handleClick = (event) => {
    if (isCardInPlay) {
      selectStat(event.target.dataset["stat"]);
      if (localStorage.getItem("sound") === "true") {
        const click = new Audio(clickSound);
        click.volume = 0.3;
        click.play();
      }
    }
  };

  const handleMouseEnter = () => {
    if (isCardInPlay && hints) {
      onStatHover(statName);
    }
  };

  const handleMouseLeave = () => {
    if (isCardInPlay && hints) {
      onStatHoverLeave(statName);
    }
  };

  return (
    <div
      className={className}
      data-stat={statName}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative" }}
    >
      <p
        data-testid={`${statName === "ph_range" ? "average-ph" : statName}-text`}
      >
        {value}
      </p>
      {hints && hoveredStats[statName] && <StatHint stat={statName} />}
    </div>
  );
};

export const Card = ({
  plant,
  onClick,
  setOpeningHand,
  isTwoCardsChoice,
  isCardInPlay,
  selectStat,
  opponentCardShow,
  hints,
}) => {
  // Track hover state for each stat separately
  const [hoveredStats, setHoveredStats] = useState({
    year: false,
    edible: false,
    ph_range: false,
    light: false,
    soil_nutriments: false,
    atmospheric_humidity: false,
  });

  const onStatHover = (statName) => {
    setHoveredStats((prev) => ({
      ...prev,
      [statName]: true,
    }));
  };

  const onStatHoverLeave = (statName) => {
    setHoveredStats((prev) => ({
      ...prev,
      [statName]: false,
    }));
  };

  // Get the appropriate image URL (using cached results if available)
  const imageUrl = getImageUrl(plant.image_url, fallbackPlantImage);

  // Handle image loading error as a backup
  const handleImageError = (e) => {
    e.target.src = fallbackPlantImage; // Replace with fallback image
    e.target.onerror = null; // Prevent infinite loop if fallback also fails
  };

  // Define the stat data to render
  const stats = [
    {
      className: "year-container",
      statName: "year",
      value: plant.year,
    },
    {
      className: "edible-container",
      statName: "edible",
      value: plant.edible ? "Yes" : "No",
    },
    {
      className: "average-ph-container",
      statName: "ph_range",
      value: plant.ph_levels.ph_range,
    },
    {
      className: "light-container",
      statName: "light",
      value: plant.light,
    },
    {
      className: "nutrients-container",
      statName: "soil_nutriments",
      value: plant.soil_nutriments,
    },
    {
      className: "water-required-container",
      statName: "atmospheric_humidity",
      value: plant.atmospheric_humidity,
    },
  ];
  // add 'if opponent card show', reduce width of card back to 0 and increase 
  // width of card front to 100% with transition ease
  return (
    <>
      {plant.owner.trim() === "opponent" && !opponentCardShow ? (
        <img className="card" src={cardBackImage} />
      ) : (
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
          data-in-play={isCardInPlay ? "true" : "false"}
        >
          <p data-testid="common-name">{plant.common_name}</p>
          <p data-testid="scientific-name">{plant.scientific_name}</p>
          <img
            data-testid="image-url"
            src={imageUrl}
            alt={plant.common_name}
            onError={handleImageError}
          />

          {stats.map((stat) => (
            <StatContainer
              key={stat.statName}
              className={stat.className}
              statName={stat.statName}
              value={stat.value}
              isCardInPlay={isCardInPlay}
              selectStat={selectStat}
              hints={hints}
              hoveredStats={hoveredStats}
              onStatHover={onStatHover}
              onStatHoverLeave={onStatHoverLeave}
            />
          ))}
        </article>
      )}
    </>
  );
};
