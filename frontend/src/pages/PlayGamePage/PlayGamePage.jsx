import { useEffect } from "react";
import { CardContainer } from "../../components/CardContainer/CardContainer";
import { useState } from "react";

export const PlayGamePage = () => {
  const [playerInitialTenCards, setPlayerInitialTenCards] = useState([]); // 10 cards array
  const [computerHand, setComputerHand] = useState([]); // 10 cards array
  const [twoCardsChoice, setTwoCardsChoice] = useState([]); // 2 cards array
  const [openingHand, setOpeningHand] = useState([]); // 5 cards array

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
            "https://www.nature-and-garden.com/wp-content/uploads/sites/2/silver-birch.jpg",
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
            "https://www.gardeningknowhow.com/wp-content/uploads/2020/07/lambs-ear-plant.jpg",
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
            "https://cdn.britannica.com/53/235853-050-EC257DA4/Pineapple-sage-flowers.jpg",
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
            "https://upload.wikimedia.org/wikipedia/commons/2/2d/Dracaena_draco_G2.jpg",
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
            "https://www.houseplantsexpert.com/image-files/oyster-plant.jpg",
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
            "https://www.almanac.com/sites/default/files/styles/primary_image_in_article/public/image_nodes/foxglove-plant.jpg",
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
            "https://www.thespruce.com/thmb/S6kx8L27x1oLkXbBOAyZ6S6piSU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/grow-butterfly-weed-1402154-01-1b0c0cfb78e14cf99c1094a8282a1a90.jpg",
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
            "https://upload.wikimedia.org/wikipedia/commons/0/08/Nasturtium_officinale_Watercress.jpg",
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
            "https://www.gardeningknowhow.com/wp-content/uploads/2020/10/stonecrop.jpg",
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
            "https://cdn.shopify.com/s/files/1/0094/0794/7360/products/MAG-BLACKTULIP_800x.jpg?v=1587749737",
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
      const shuffledCardsPlayer = shuffled.slice(0, 10);
      setComputerHand(shuffled.slice(11, 16))
      const [first, second, ...rest] = shuffledCardsPlayer;
      setPlayerInitialTenCards(rest);
      setTwoCardsChoice([first, second]);
      console.log("opponent's hand", computerHand)
      console.log("player's hand", playerInitialTenCards)
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

  return (
    <>
      <h1 data-testid="play-game">Play game</h1>
      {/* <CardContainer plants={initialTenCards} /> */}

      {twoCardsChoice && twoCardsChoice.length > 0 && <h1>Pick a card</h1>}
      {twoCardsChoice && twoCardsChoice.length > 0 && (
        <CardContainer
          onClickHandle={onClickHandle}
          setOpeningHand={setOpeningHand}
          plants={twoCardsChoice}
        />
      )}

      {openingHand && openingHand.length > 0 && <h1>Opening hand</h1>}
      {openingHand && openingHand.length > 0 && (
        <CardContainer plants={openingHand} />
      )}
      <h1> Opponent hand</h1>
      <CardContainer plants={computerHand} />
    </>
  );
};
