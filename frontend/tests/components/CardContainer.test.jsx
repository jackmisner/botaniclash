import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CardContainer } from "../../src/components/CardContainer/CardContainer";
import { vi, expect } from "vitest";

describe("CardContainer", () => {
  const mockPlants = [
    {
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
    },
    {
      id: 2,
      common_name: "Sunflower",
      scientific_name: "Helianthus annuus",
      image_url: "https://example.com/sunflower.jpg",
      year: "1982",
      edible: true,
      ph_levels: { ph_range: "5.8" },
      light: "9",
      soil_nutriments: "high",
      atmospheric_humidityq: "medium",
    },
  ];

  test("renders nothing when plants array is empty", () => {
    const { container } = render(
      <MemoryRouter>
        <CardContainer
          plants={[]}
          onClickHandle={() => {}}
          setOpeningHand={() => {}}
        />
      </MemoryRouter>,
    );

    const cardsContainer = container.querySelector(".cards-container");
    expect(cardsContainer).not.toBeNull();
    expect(cardsContainer.children.length).toBe(0);
  });

  test("renders correct number of Card components when plants array has items", () => {
    render(
      <MemoryRouter>
        <CardContainer
          plants={mockPlants}
          onClickHandle={() => {}}
          setOpeningHand={() => {}}
        />
      </MemoryRouter>,
    );

    const commonNames = screen.getAllByTestId("common-name");
    expect(commonNames.length).toBe(2);
    expect(commonNames[0].textContent).toBe("Common Dandelion");
    expect(commonNames[1].textContent).toBe("Sunflower");
  });

  test("passes the correct props to each Card component", () => {
    render(
      <MemoryRouter>
        <CardContainer
          plants={mockPlants}
          onClickHandle={() => {}}
          setOpeningHand={() => {}}
        />
      </MemoryRouter>,
    );

    const scientificNames = screen.getAllByTestId("scientific-name");
    expect(scientificNames[0].textContent).toBe("Taraxacum officinale");
    expect(scientificNames[1].textContent).toBe("Helianthus annuus");

    const years = screen.getAllByTestId("year-text");
    expect(years[0].textContent).toBe("1990");
    expect(years[1].textContent).toBe("1982");

    const lights = screen.getAllByTestId("light-text");
    expect(lights[0].textContent).toBe("8");
    expect(lights[1].textContent).toBe("9");
  });

  test("onClickHandle is called when a card is clicked", () => {
    const mockOnClickHandle = vi.fn();
    const mockSetOpeningHand = vi.fn((callback) => callback([]));

    render(
      <MemoryRouter>
        <CardContainer
          plants={mockPlants}
          onClickHandle={mockOnClickHandle}
          setOpeningHand={mockSetOpeningHand}
          isTwoCardsChoice={true}
        />
      </MemoryRouter>,
    );

    const cards = screen.getAllByRole("article");
    fireEvent.click(cards[0]);

    expect(mockOnClickHandle).toHaveBeenCalledTimes(1);
  });

  test("setOpeningHand is called with the correct plant when a card is clicked", () => {
    const mockOnClickHandle = vi.fn();
    const mockSetOpeningHand = vi.fn((callback) => callback([]));

    render(
      <MemoryRouter>
        <CardContainer
          plants={mockPlants}
          onClickHandle={mockOnClickHandle}
          setOpeningHand={mockSetOpeningHand}
          isTwoCardsChoice={true}
        />
      </MemoryRouter>,
    );

    const cards = screen.getAllByRole("article");
    fireEvent.click(cards[1]); // Click the second card

    expect(mockSetOpeningHand).toHaveBeenCalledTimes(1);
    expect(mockSetOpeningHand.mock.results[0].value).toEqual([mockPlants[1]]);
  });

  test("handles a single plant in the array", () => {
    const singlePlant = [mockPlants[0]];

    render(
      <MemoryRouter>
        <CardContainer
          plants={singlePlant}
          onClickHandle={() => {}}
          setOpeningHand={() => {}}
        />
      </MemoryRouter>,
    );

    const commonNames = screen.getAllByTestId("common-name");
    expect(commonNames.length).toBe(1);
    expect(commonNames[0].textContent).toBe("Common Dandelion");
  });

  test("CardContainer provides correct key prop to each Card", () => {
    const consoleSpy = vi.spyOn(console, "error");

    render(
      <MemoryRouter>
        <CardContainer
          plants={mockPlants}
          onClickHandle={() => {}}
          setOpeningHand={() => {}}
        />
      </MemoryRouter>,
    );

    // Check if there were any console errors related to keys
    const keyWarnings = consoleSpy.mock.calls.filter((call) =>
      call[0]?.includes("key"),
    );

    expect(keyWarnings.length).toBe(0);
    consoleSpy.mockRestore();
  });
});
