import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Card } from "../../src/components/Card/Card";
import { vi, expect } from "vitest";

// Mock the image preloader service
vi.mock("../../src/services/imagePreloader", () => ({
  getImageUrl: vi.fn().mockImplementation((url, fallback) => url || fallback),
  preloadPlantImages: vi.fn().mockResolvedValue(true),
}));

vi.mock("../../src/assets/plant-fallback.png", () => {
  return {
    default: "mocked-fallback-image-path",
  };
});

vi.mock("../../src/assets/card-back.png", () => {
  return {
    default: "mocked-card-back-image-path",
  };
});

describe("Card", () => {
  const defaultPlant = {
    id: 1,
    common_name: "Common Dandelion",
    scientific_name: "Taraxacum officinale",
    image_url:
      "https://images.immediate.co.uk/production/volatile/sites/10/2018/02/61078405-281c-4a49-8d1e-2e445fe64960-378bd75.jpg",
    year: "1990",
    edible: true,
    ph_levels: { ph_range: "6.1" },
    light: "8",
    soil_nutriments: "medium",
    atmospheric_humidity: "high",
    owner: "player",
  };

  test("card displays correct measures", () => {
    render(
      <MemoryRouter>
        <Card
          plant={defaultPlant}
          onClick={() => {}}
          setOpeningHand={() => {}}
        />
      </MemoryRouter>,
    );

    const pCommonName = screen.getByTestId("common-name");
    const pScientificName = screen.getByTestId("scientific-name");
    const pImageUrl = screen.getByTestId("image-url");
    const pYear = screen.getByTestId("year-text");
    const pEdible = screen.getByTestId("edible-text");
    const pLight = screen.getByTestId("light-text");
    const pAtmosphericHumidity = screen.getByTestId(
      "atmospheric_humidity-text",
    );
    const pSoilNutriments = screen.getByTestId("soil_nutriments-text");
    const pAveragePh = screen.getByTestId("average-ph-text");
    expect(pCommonName.textContent).toBe("Common Dandelion");
    expect(pScientificName.textContent).toBe("Taraxacum officinale");
    expect(pImageUrl.src).toBe(
      "https://images.immediate.co.uk/production/volatile/sites/10/2018/02/61078405-281c-4a49-8d1e-2e445fe64960-378bd75.jpg",
    );
    expect(pYear.textContent).toBe("1990");
    expect(pEdible.textContent).toBe("Yes");
    expect(pLight.textContent).toBe("8");
    expect(pAtmosphericHumidity.textContent).toBe("high");
    expect(pSoilNutriments.textContent).toBe("medium");
    expect(pAveragePh.textContent).toBe("6.1");
  });

  // Rest of the tests remain the same...
  test("onClick function is called when card is clicked", () => {
    const mockOnClick = vi.fn();
    const mockSetOpeningHand = vi.fn();

    render(
      <MemoryRouter>
        <Card
          plant={defaultPlant}
          onClick={mockOnClick}
          setOpeningHand={mockSetOpeningHand}
          isTwoCardsChoice={true}
        />
      </MemoryRouter>,
    );

    const card = screen.getByRole("article");
    act(() => {
      fireEvent.click(card);
    });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("setOpeningHand function is called and updates state when card is clicked", () => {
    const mockOnClick = vi.fn();
    const mockSetOpeningHand = vi.fn((fn) => {
      const prev = [];
      return fn(prev);
    });

    render(
      <MemoryRouter>
        <Card
          plant={defaultPlant}
          onClick={mockOnClick}
          setOpeningHand={mockSetOpeningHand}
          isTwoCardsChoice={true}
        />
      </MemoryRouter>,
    );

    const card = screen.getByRole("article");
    fireEvent.click(card);

    expect(mockSetOpeningHand).toHaveBeenCalledTimes(1);
    expect(mockSetOpeningHand.mock.results[0].value).toEqual([defaultPlant]);
  });

  test("card displays 'No' when plant is not edible", () => {
    const nonEdiblePlant = {
      ...defaultPlant,
      edible: false,
    };

    render(
      <MemoryRouter>
        <Card
          plant={nonEdiblePlant}
          onClick={() => {}}
          setOpeningHand={() => {}}
        />
      </MemoryRouter>,
    );

    const pEdible = screen.getByTestId("edible-text");
    expect(pEdible.textContent).toBe("No");
  });

  test("card handles null properties gracefully", () => {
    const plantWithNullProps = {
      ...defaultPlant,
      soil_nutriments: null,
      atmospheric_humidity: null,
      ph_levels: { ph_range: null },
    };

    render(
      <MemoryRouter>
        <Card
          plant={plantWithNullProps}
          onClick={() => {}}
          setOpeningHand={() => {}}
        />
      </MemoryRouter>,
    );

    const pSoilNutriments = screen.getByTestId("soil_nutriments-text");
    const pAtmosphericHumidity = screen.getByTestId(
      "atmospheric_humidity-text",
    );
    const pAveragePh = screen.getByTestId("average-ph-text");

    expect(pSoilNutriments.textContent).toBe("");
    expect(pAtmosphericHumidity.textContent).toBe("");
    expect(pAveragePh.textContent).toBe("");
  });
});

describe("Card - Additional Tests", () => {
  const defaultPlant = {
    id: 1,
    common_name: "Common Dandelion",
    scientific_name: "Taraxacum officinale",
    image_url: "https://example.com/dandelion.jpg",
    year: "1990",
    edible: true,
    ph_levels: { ph_range: "6.1" },
    light: "8",
    soil_nutriments: "medium",
    atmospheric_humidity: "high",
    owner: "player",
  };

  const opponentPlant = {
    ...defaultPlant,
    owner: "opponent",
  };

  test("should not call onClick when isTwoCardsChoice is false", () => {
    const mockOnClick = vi.fn();
    const mockSetOpeningHand = vi.fn();

    render(
      <MemoryRouter>
        <Card
          plant={defaultPlant}
          onClick={mockOnClick}
          setOpeningHand={mockSetOpeningHand}
          isTwoCardsChoice={false}
        />
      </MemoryRouter>,
    );

    const card = screen.getByRole("article");
    fireEvent.click(card);

    expect(mockOnClick).not.toHaveBeenCalled();
    expect(mockSetOpeningHand).not.toHaveBeenCalled();
  });

  test("should show card back image when plant owner is opponent and opponentCardShow is false", () => {
    render(
      <MemoryRouter>
        <Card
          plant={opponentPlant}
          onClick={() => {}}
          setOpeningHand={() => {}}
          opponentCardShow={false}
        />
      </MemoryRouter>,
    );

    const cardBackImg = screen.getByRole("img");
    expect(cardBackImg.src).toBe(
      "http://localhost:3000/mocked-card-back-image-path",
    );
    expect(cardBackImg.className).toBe("card");
  });

  test("should show opponent card when opponentCardShow is true", () => {
    render(
      <MemoryRouter>
        <Card
          plant={opponentPlant}
          onClick={() => {}}
          setOpeningHand={() => {}}
          opponentCardShow={true}
        />
      </MemoryRouter>,
    );

    // Check elements exist
    expect(screen.queryByTestId("common-name")).not.toBeNull();
    expect(screen.queryByTestId("scientific-name")).not.toBeNull();
  });

  test("selectStat function is called when stat container is clicked and card is in play", () => {
    const mockSelectStat = vi.fn();

    render(
      <MemoryRouter>
        <Card
          plant={defaultPlant}
          onClick={() => {}}
          setOpeningHand={() => {}}
          isCardInPlay={true}
          selectStat={mockSelectStat}
        />
      </MemoryRouter>,
    );

    // Click on different stat containers
    fireEvent.click(screen.getByTestId("year-text").parentElement);
    expect(mockSelectStat).toHaveBeenCalledWith("year");

    fireEvent.click(screen.getByTestId("edible-text").parentElement);
    expect(mockSelectStat).toHaveBeenCalledWith("edible");

    fireEvent.click(screen.getByTestId("average-ph-text").parentElement);
    expect(mockSelectStat).toHaveBeenCalledWith("ph_range");

    fireEvent.click(screen.getByTestId("light-text").parentElement);
    expect(mockSelectStat).toHaveBeenCalledWith("light");

    fireEvent.click(screen.getByTestId("soil_nutriments-text").parentElement);
    expect(mockSelectStat).toHaveBeenCalledWith("soil_nutriments");

    fireEvent.click(
      screen.getByTestId("atmospheric_humidity-text").parentElement,
    );
    expect(mockSelectStat).toHaveBeenCalledWith("atmospheric_humidity");
  });

  test("selectStat function is not called when card is not in play", () => {
    const mockSelectStat = vi.fn();

    render(
      <MemoryRouter>
        <Card
          plant={defaultPlant}
          onClick={() => {}}
          setOpeningHand={() => {}}
          isCardInPlay={false}
          selectStat={mockSelectStat}
        />
      </MemoryRouter>,
    );

    // Click on a stat container
    fireEvent.click(screen.getByTestId("year-text").parentElement);
    expect(mockSelectStat).not.toHaveBeenCalled();
  });

  test("card in play status is reflected in the data-in-play attribute", () => {
    // Test with isCardInPlay = true
    const { rerender } = render(
      <MemoryRouter>
        <Card
          plant={defaultPlant}
          onClick={() => {}}
          setOpeningHand={() => {}}
          isCardInPlay={true}
        />
      </MemoryRouter>,
    );

    let card = screen.getByRole("article");
    expect(card.getAttribute("data-in-play")).toBe("true");

    // Rerender with isCardInPlay = false
    rerender(
      <MemoryRouter>
        <Card
          plant={defaultPlant}
          onClick={() => {}}
          setOpeningHand={() => {}}
          isCardInPlay={false}
        />
      </MemoryRouter>,
    );

    card = screen.getByRole("article");
    expect(card.getAttribute("data-in-play")).toBe("false");
  });

  test("handleImageError sets fallback image when image fails to load", () => {
    render(
      <MemoryRouter>
        <Card
          plant={defaultPlant}
          onClick={() => {}}
          setOpeningHand={() => {}}
        />
      </MemoryRouter>,
    );

    const img = screen.getByTestId("image-url");
    // Simulate an error on the image
    fireEvent.error(img);

    // Check that the src has been updated to the fallback image
    expect(img.src).toBe(`http://localhost:3000/mocked-fallback-image-path`);
  });
});
