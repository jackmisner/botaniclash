/**
 * A component that renders a plant card for the BotaniClash game.
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.plant - The plant data object to display
 * @param {Function} props.onClick - Click handler for the card
 * @param {Function} props.setOpeningHand - Function to update the opening hand state
 * @param {boolean} props.isTwoCardsChoice - Flag indicating if the card is part of the two-card selection phase
 * @param {boolean} props.isCardInPlay - Flag indicating if the card is currently in play
 * @param {Function} props.selectStat - Function to handle stat selection
 * @param {boolean} props.opponentCardShow - Flag indicating if opponent's card should be shown
 * @param {boolean} props.hints - Flag indicating if stat hints should be displayed
 * @returns {JSX.Element} A card component displaying plant information or a card back image
 */

import "./Card.css";
import fallbackPlantImage from "../../assets/plant-fallback.png";
import cardBackImage from "../../assets/card-back.png";
import { getImageUrl } from "../../services/imagePreloader";
import { StatHint } from "../StatHint/StatHint";
import { useState } from "react";

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
  const onStatContainerClick = (event) => {
    selectStat(event.target.dataset["stat"]);
  };

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
          <div
            className="year-container"
            data-stat="year"
            onClick={(event) => {
              if (isCardInPlay) {
                onStatContainerClick(event);
              }
            }}
            onMouseEnter={() => {
              if (isCardInPlay && hints) {
                onStatHover("year");
              }
            }}
            onMouseLeave={() => {
              if (isCardInPlay && hints) {
                onStatHoverLeave("year");
              }
            }}
            style={{ position: "relative" }} // Important for absolute positioning of hint
          >
            <p data-testid="year-text">{plant.year}</p>
            {hints && hoveredStats.year && <StatHint stat="year" />}
          </div>

          <div
            className="edible-container"
            data-stat="edible"
            onClick={(event) => {
              if (isCardInPlay) {
                onStatContainerClick(event);
              }
            }}
            onMouseEnter={() => {
              if (isCardInPlay && hints) {
                onStatHover("edible");
              }
            }}
            onMouseLeave={() => {
              if (isCardInPlay && hints) {
                onStatHoverLeave("edible");
              }
            }}
            style={{ position: "relative" }}
          >
            <p data-testid="edible-text">{plant.edible ? "Yes" : "No"}</p>
            {hints && hoveredStats.edible && <StatHint stat="edible" />}
          </div>

          <div
            className="average-ph-container"
            data-stat="ph_range"
            onClick={(event) => {
              if (isCardInPlay) {
                onStatContainerClick(event);
              }
            }}
            onMouseEnter={() => {
              if (isCardInPlay && hints) {
                onStatHover("ph_range");
              }
            }}
            onMouseLeave={() => {
              if (isCardInPlay && hints) {
                onStatHoverLeave("ph_range");
              }
            }}
            style={{ position: "relative" }}
          >
            <p data-testid="average-ph-text">{plant.ph_levels.ph_range}</p>
            {hints && hoveredStats.ph_range && <StatHint stat="ph_range" />}
          </div>

          <div
            className="light-container"
            data-stat="light"
            onClick={(event) => {
              if (isCardInPlay) {
                onStatContainerClick(event);
              }
            }}
            onMouseEnter={() => {
              if (isCardInPlay && hints) {
                onStatHover("light");
              }
            }}
            onMouseLeave={() => {
              if (isCardInPlay && hints) {
                onStatHoverLeave("light");
              }
            }}
            style={{ position: "relative" }}
          >
            <p data-testid="light-text">{plant.light}</p>
            {hints && hoveredStats.light && <StatHint stat="light" />}
          </div>

          <div
            className="nutrients-container"
            data-stat="soil_nutriments"
            onClick={(event) => {
              if (isCardInPlay) {
                onStatContainerClick(event);
              }
            }}
            onMouseEnter={() => {
              if (isCardInPlay && hints) {
                onStatHover("soil_nutriments");
              }
            }}
            onMouseLeave={() => {
              if (isCardInPlay && hints) {
                onStatHoverLeave("soil_nutriments");
              }
            }}
            style={{ position: "relative" }}
          >
            <p data-testid="nutrients-text">{plant.soil_nutriments}</p>
            {hints && hoveredStats.soil_nutriments && (
              <StatHint stat="soil_nutriments" />
            )}
          </div>

          <div
            className="water-required-container"
            data-stat="atmospheric_humidity"
            onClick={(event) => {
              if (isCardInPlay) {
                onStatContainerClick(event);
              }
            }}
            onMouseEnter={() => {
              if (isCardInPlay && hints) {
                onStatHover("atmospheric_humidity");
              }
            }}
            onMouseLeave={() => {
              if (isCardInPlay && hints) {
                onStatHoverLeave("atmospheric_humidity");
              }
            }}
            style={{ position: "relative" }}
          >
            <p data-testid="water-text">{plant.atmospheric_humidity}</p>
            {hints && hoveredStats.atmospheric_humidity && (
              <StatHint stat="atmospheric_humidity" />
            )}
          </div>
        </article>
      )}
    </>
  );
};
