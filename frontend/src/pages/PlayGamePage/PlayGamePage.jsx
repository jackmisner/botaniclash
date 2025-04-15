import { useEffect } from "react";
import { CardContainer } from "../../components/CardContainer/CardContainer";
import { useState } from "react";

export const PlayGamePage = () => {
  const [initialTenCards, setInitialTenCards] = useState([]); // 10 cards array
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
          light: "9",
          growth_rate: "Slow",

          average_height: "100",
        },
        {
          id: 2,
          common_name: "English Walnut",
          scientific_name: "Juglans regia",
          image_url:
            "https://en-gb.bakker.com/cdn/shop/products/90524-01-BAKI.jpg?v=1647965545&width=1946",
          year: "1462",
          edible: "Yes",
          light: "4",
          growth_rate: "Medium",

          average_height: "75",
        },
        {
          id: 3,
          common_name: "Sunburst Fern",
          scientific_name: "Pteridium radiata",
          image_url:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvZbWViaXGSVNNDnAKNm9DxDrh2i2TfQjjFQ&s",
          year: "1820",
          edible: "No",
          light: "6",
          growth_rate: "Fast",

          average_height: "60",
        },
        {
          id: 4,
          common_name: "Crimson Clover",
          scientific_name: "Trifolium incarnatum",
          image_url:
            "https://www.gardenia.net/wp-content/uploads/2023/04/8bFQwltHPdt6PD72z5Uqp0mBtBDBuvWeEdWIBOMn-780x520.webp",
          year: "1775",
          edible: "Yes",
          light: "8",
          growth_rate: "Medium",

          average_height: "45",
        },
        {
          id: 5,
          common_name: "Bluebell Vine",
          scientific_name: "Clitoria ternatea",
          image_url:
            "https://www.thompson-morgan.com/product_images/100/sollya2.jpg",
          year: "1934",
          edible: "Yes",
          light: "7",
          growth_rate: "Fast",

          average_height: "30",
        },
        {
          id: 6,
          common_name: "Ghost Mushroom",
          scientific_name: "Omphalotus nidiformis",
          image_url:
            "https://upload.wikimedia.org/wikipedia/commons/d/dd/Omphalotus_nidiformis_Binnamittalong_2_email.jpg",
          year: "1870",
          edible: "No",
          light: "2",
          growth_rate: "Slow",

          average_height: "15",
        },
        {
          id: 7,
          common_name: "Skyvine Tree",
          scientific_name: "Arbor caelestis",
          image_url:
            "https://www.south-florida-plant-guide.com/images/sky-vine-1-500.jpg",
          year: "1500",
          edible: "No",
          light: "10",
          growth_rate: "Medium",

          average_height: "120",
        },
        {
          id: 8,
          common_name: "Wild Sage",
          scientific_name: "Salvia veridis",
          image_url:
            "https://images.immediate.co.uk/production/volatile/sites/10/2018/08/e7b91e43-e0e2-4c53-9d19-1110fa700346-c9db5e7.jpg",
          year: "1750",
          edible: "Yes",
          light: "9",
          growth_rate: "Slow",

          average_height: "55",
        },
        {
          id: 9,

          common_name: "Velvet Moss",
          scientific_name: "Bryum softia",
          image_url:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGuxgeWDI7KUPdQ364Xx2nIPH_R78CTZCEPQ&s",
          year: "1620",
          edible: "No",
          light: "3",
          growth_rate: "Slow",

          average_height: "5",
        },
        {
          id: 10,
          common_name: "Golden Bamboo",
          scientific_name: "Phyllostachys aurea",
          image_url:
            "https://www.gardeningexpress.co.uk/media/catalog/product/cache/fa4e57de89a0fb1427d2c82c53fb200f/p/h/phyllostachys-aurea-aureocaulis2_1.jpg",
          year: "1895",
          edible: "Yes",
          light: "8",
          growth_rate: "Very Fast",

          average_height: "90",
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
      const [first, second, ...rest] = shuffled;

      setInitialTenCards(rest);
      setTwoCardsChoice([first, second]);
      // console.log(initialTenCards);
      // return data;
    });

    // setInitialTenCards((prev) => {
    //     [prev.pop()];
    // });
    // console.log("two cards choice", twoCardsChoice);
  }, []);

  const onClickHandle = () => {
    if (initialTenCards.length > 1) {
      const shuffled = shuffle(initialTenCards);
      const [first, second, ...rest] = shuffled;

      setInitialTenCards(rest);
      setTwoCardsChoice([first, second]);
    } else {
      // No more cards left, clear the twoCardsChoice array
      setTwoCardsChoice([]);
    }
  };

  return (
    <>
      {/* <h1 data-testid="play-game">Play game</h1> */}
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
    </>
  );
};
