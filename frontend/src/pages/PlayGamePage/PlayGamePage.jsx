import { useEffect } from "react";
import { CardContainer } from "../../components/CardContainer/CardContainer";
import { useState } from "react";

export const PlayGamePage = () => {
  const [playerInitialTenCards, setPlayerInitialTenCards] = useState([]); // 10 cards array
  const [opponentHand, setOpponentHand] = useState([]); // 10 cards array
  const [twoCardsChoice, setTwoCardsChoice] = useState([]); // 2 cards array
  const [playerHand, setPlayerHand] = useState([]); // 5 cards array
  const [cardsInPlay, setCardsInPlay] = useState([]); // top cards from both opponent and player
  const [gameWinner, setGameWinner] = useState("");
  const [statInPlay, setStatInPlay] = useState("");
  const [playerStatValue, setPlayerStatValue] = useState("");
  const [opponentStatValue, setOpponentStatValue] = useState("");
  const [owner, setOwner] = useState("");
  const returnServerData = () => {
    let myPromise = new Promise(function (myResolve, myReject) {
      const mockPlants = [
        {
          id: 1,
          common_name: "Common Dandelion",
          scientific_name: "Taraxacum officinale",
          image_url:
            "https://images.immediate.co.uk/production/volatile/sites/10/2018/02/61078405-281c-4a49-8d1e-2e445fe64960-378bd75.jpg",
          year: "1990",
          edible: "Yes",
          average_pH: "6.1",
          light: "8",
          nutrients_required: "medium",
          water_required: "high",
        },
        {
          id: 2,
          common_name: "English Walnut",
          scientific_name: "Juglans regia",
          image_url:
            "https://en-gb.bakker.com/cdn/shop/products/90524-01-BAKI.jpg?v=1647965545&width=1946",
          year: "1462",
          edible: "Yes",
          average_pH: "6.8",
          light: "7",
          nutrients_required: "high",
          water_required: "low",
        },
        {
          id: 3,
          common_name: "Sunburst Fern",
          scientific_name: "Pteridium radiata",
          image_url:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvZbWViaXGSVNNDnAKNm9DxDrh2i2TfQjjFQ&s",
          year: "1820",
          edible: "No",
          average_pH: "5.5",
          light: "4",
          nutrients_required: "medium",
          water_required: "very high",
        },
        {
          id: 4,
          common_name: "Crimson Clover",
          scientific_name: "Trifolium incarnatum",
          image_url:
            "https://www.gardenia.net/wp-content/uploads/2023/04/8bFQwltHPdt6PD72z5Uqp0mBtBDBuvWeEdWIBOMn-780x520.webp",
          year: "1775",
          edible: "Yes",
          average_pH: "7.2",
          light: "10",
          nutrients_required: "low",
          water_required: "very low",
        },
        {
          id: 5,
          common_name: "Bluebell Vine",
          scientific_name: "Clitoria ternatea",
          image_url:
            "https://www.thompson-morgan.com/product_images/100/sollya2.jpg",
          year: "1934",
          edible: "Yes",
          average_pH: "6.3",
          light: "6",
          nutrients_required: "medium",
          water_required: "medium",
        },
        {
          id: 6,
          common_name: "Ghost Mushroom",
          scientific_name: "Omphalotus nidiformis",
          image_url:
            "https://upload.wikimedia.org/wikipedia/commons/d/dd/Omphalotus_nidiformis_Binnamittalong_2_email.jpg",
          year: "1870",
          edible: "No",
          average_pH: "5.9",
          light: "2",
          nutrients_required: "very low",
          water_required: "high",
        },
        {
          id: 7,
          common_name: "Skyvine Tree",
          scientific_name: "Arbor caelestis",
          image_url:
            "https://www.south-florida-plant-guide.com/images/sky-vine-1-500.jpg",
          year: "1500",
          edible: "No",
          average_pH: "7.0",
          light: "5",
          nutrients_required: "very high",
          water_required: "medium",
        },
        {
          id: 8,
          common_name: "Wild Sage",
          scientific_name: "Salvia veridis",
          image_url:
            "https://images.immediate.co.uk/production/volatile/sites/10/2018/08/e7b91e43-e0e2-4c53-9d19-1110fa700346-c9db5e7.jpg",
          year: "1750",
          edible: "Yes",
          average_pH: "6.7",
          light: "3",
          nutrients_required: "medium",
          water_required: "low",
        },
        {
          id: 9,
          common_name: "Velvet Moss",
          scientific_name: "Bryum softia",
          image_url:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGuxgeWDI7KUPdQ364Xx2nIPH_R78CTZCEPQ&s",
          year: "1620",
          edible: "No",
          average_pH: "5.2",
          light: "1",
          nutrients_required: "very low",
          water_required: "extreme",
        },
        {
          id: 10,
          common_name: "Golden Bamboo",
          scientific_name: "Phyllostachys aurea",
          image_url:
            "https://www.gardeningexpress.co.uk/media/catalog/product/cache/fa4e57de89a0fb1427d2c82c53fb200f/p/h/phyllostachys-aurea-aureocaulis2_1.jpg",
          year: "1895",
          edible: "Yes",
          average_pH: "7.5",
          light: "9",
          nutrients_required: "medium",
          water_required: "low",
        },
        {
          id: 11,
          common_name: "Silver Birch",
          scientific_name: "Betula pendula",
          image_url:
            "https://www.rjtreesandhedging.co.uk/images/silver-birch-betula-pendula-p54-329_image.jpg",
          year: "1753",
          edible: "No",
          average_pH: "5.8",
          light: "9",
          nutrients_required: "low",
          water_required: "medium",
        },
        {
          id: 12,
          common_name: "Lamb's Ear",
          scientific_name: "Stachys byzantina",
          image_url:
            "https://thenunheadgardener.com/wp-content/uploads/images/28000000000000717-1.jpg",
          year: "1782",
          edible: "No",
          average_pH: "6.4",
          light: "7",
          nutrients_required: "medium",
          water_required: "low",
        },
        {
          id: 13,
          common_name: "Pineapple Sage",
          scientific_name: "Salvia elegans",
          image_url:
            "https://images.immediate.co.uk/production/volatile/sites/10/2018/08/8e39f451-b449-4d0e-9b0d-e289ba3bb98f-5dcf420.jpg",
          year: "1877",
          edible: "Yes",
          average_pH: "6.5",
          light: "8",
          nutrients_required: "medium",
          water_required: "medium",
        },
        {
          id: 14,
          common_name: "Dragon Tree",
          scientific_name: "Dracaena draco",
          image_url:
            "https://www.gardenia.net/wp-content/uploads/2023/04/Dragon-tree-Dracaena-draco5.webp",
          year: "1768",
          edible: "No",
          average_pH: "6.0",
          light: "5",
          nutrients_required: "low",
          water_required: "low",
        },
        {
          id: 15,
          common_name: "Oyster Plant",
          scientific_name: "Tradescantia spathacea",
          image_url:
            "https://www.nparks.gov.sg/-/media/ffw/migrated/round2/flora/2524/0981e04ef5974513853d46ebc918cce4.jpg",
          year: "1851",
          edible: "Yes",
          average_pH: "6.2",
          light: "6",
          nutrients_required: "medium",
          water_required: "medium",
        },
        {
          id: 16,
          common_name: "Foxglove",
          scientific_name: "Digitalis purpurea",
          image_url:
            "https://www.gardenia.net/wp-content/uploads/2023/05/digitalis-purpurea-common-foxglove.webp",
          year: "1650",
          edible: "No",
          average_pH: "6.1",
          light: "7",
          nutrients_required: "high",
          water_required: "medium",
        },
        {
          id: 17,
          common_name: "Butterfly Weed",
          scientific_name: "Asclepias tuberosa",
          image_url:
            "https://apps.rhs.org.uk/plantselectorimages/detail/vaem09211.jpg",
          year: "1805",
          edible: "No",
          average_pH: "6.7",
          light: "10",
          nutrients_required: "medium",
          water_required: "low",
        },
        {
          id: 18,
          common_name: "Watercress",
          scientific_name: "Nasturtium officinale",
          image_url:
            "https://www.plant-world-seeds.com/images/item_images/000/009/483/large_square/NASTURTIUM_OFFICINALE.JPG?1669475514",
          year: "1501",
          edible: "Yes",
          average_pH: "6.3",
          light: "4",
          nutrients_required: "high",
          water_required: "very high",
        },
        {
          id: 19,
          common_name: "Stonecrop",
          scientific_name: "Sedum acre",
          image_url:
            "https://www.gardenia.net/wp-content/uploads/2023/05/Sedum-acre-780x520.webp",
          year: "1725",
          edible: "Yes",
          average_pH: "5.6",
          light: "9",
          nutrients_required: "low",
          water_required: "very low",
        },
        {
          id: 20,
          common_name: "Black Tulip Magnolia",
          scientific_name: "Magnolia × soulangeana",
          image_url:
            "https://www.gardeningexpress.co.uk/media/catalog/product/cache/fa4e57de89a0fb1427d2c82c53fb200f/m/a/magnolia-soulangeana-750x750.jpg",
          year: "1826",
          edible: "No",
          average_pH: "6.9",
          light: "8",
          nutrients_required: "high",
          water_required: "medium",
        },
      ];
      myResolve(mockPlants); // when successful
      myReject("Error"); // when error
    });

    return myPromise;
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  useEffect(() => {
    returnServerData().then((data) => {
      const shuffled = shuffle(data);
      const shuffledCardsPlayer = shuffled.slice(0, 10).map((card) => ({
        ...card,
        owner: " player",
      })); // Assign owner to player cards
      const shuffledCardsOpponent = shuffled.slice(11, 16).map((card) => ({
        ...card,
        owner: " opponent",
      })); // Assign owner to opponent cards

      setOpponentHand(shuffledCardsOpponent);
      const [first, second, ...rest] = shuffledCardsPlayer;
      setPlayerInitialTenCards(rest);
      setTwoCardsChoice([first, second]);
    });
  }, []);

  const onClickHandle = () => {
    if (playerInitialTenCards.length > 1) {
      const [first, second, ...rest] = playerInitialTenCards;
      setPlayerInitialTenCards(rest);
      setTwoCardsChoice([first, second]);
    } else {
      // No more cards left, clear the twoCardsChoice array
      setTwoCardsChoice([]);
    }
  };

  const pickTopCards = () => {
    setCardsInPlay([playerHand[0], opponentHand[0]]);
    setPlayerHand((prev) => prev.slice(1)); // remove the first card
    setOpponentHand((prev) => prev.slice(1)); // remove the first card
  };
  const playerOneWinsComparison = () => {
    opponentHand.length === 0 && setGameWinner("Player1");
    setPlayerHand((prev) => {
      const updatedCards = cardsInPlay.map((card) => ({
        ...card,
        owner: " player",
      }));
      setCardsInPlay([]);
      return [...prev, ...updatedCards];
    });
  };
  const playerTwoWinsComparison = () => {
    playerHand.length === 0 && setGameWinner("Player2");
    setOpponentHand((prev) => {
      const updatedCards = cardsInPlay.map((card) => ({
        ...card,
        owner: " opponent",
      }));
      setCardsInPlay([]);
      return [...prev, ...updatedCards];
    });
  };

  return (
    <>
      <h1 data-testid="play-game">Play game</h1>
      {gameWinner && <h1>Winner --- {gameWinner}</h1>}
      {/* <CardContainer plants={initialTenCards} /> */}
      <button onClick={pickTopCards}>Test top cards</button>
      <button onClick={playerOneWinsComparison}>
        Player 1 wins comparison
      </button>
      <button onClick={playerTwoWinsComparison}>
        Player 2 wins comparison
      </button>
      <h1>Cards in Play</h1>
      {cardsInPlay && (
        <CardContainer
          plants={cardsInPlay}
          setStatInPlay={setStatInPlay}
          setPlayerStatValue={setPlayerStatValue}
          setOpponentStatValue={setOpponentStatValue}
        />
      )}

      {twoCardsChoice && twoCardsChoice.length > 0 && (
        <CardContainer
          onClickHandle={onClickHandle}
          setOpeningHand={setPlayerHand}
          plants={twoCardsChoice}
          isTwoCardsChoice={true} // Indicate this is the twoCardsChoice container
        />
      )}

      {playerHand && playerHand.length > 0 && <h1>Opening hand</h1>}
      {playerHand && playerHand.length > 0 && (
        <CardContainer plants={playerHand} />
      )}
      <h1> Opponent hand</h1>
      <CardContainer plants={opponentHand} />
    </>
  );
};
