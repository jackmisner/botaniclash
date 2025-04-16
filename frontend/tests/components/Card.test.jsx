import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Card } from "../../src/components/Card/Card";
import { vi } from "vitest";

describe("Card", () => {
  const defaultPlant = {
    id: 1,
    common_name: "Common Dandelion",
    scientific_name: "Taraxacum officinale",
    image_url:
      "https://images.immediate.co.uk/production/volatile/sites/10/2018/02/61078405-281c-4a49-8d1e-2e445fe64960-378bd75.jpg",
    year: "1990",
    edible: true,
    average_pH: "6.1",
    light: "8",
    nutrients_required: "medium",
    water_required: "high",
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
    const pWater = screen.getByTestId("water-text");
    const pNutrients = screen.getByTestId("nutrients-text");
    const pAveragePh = screen.getByTestId("average-ph-text");
    expect(pCommonName.textContent).toBe("Common Dandelion");
    expect(pScientificName.textContent).toBe("Taraxacum officinale");
    expect(pImageUrl.src).toBe(
      "https://images.immediate.co.uk/production/volatile/sites/10/2018/02/61078405-281c-4a49-8d1e-2e445fe64960-378bd75.jpg",
    );
    expect(pYear.textContent).toBe("1990");
    expect(pEdible.textContent).toBe("Yes");
    expect(pLight.textContent).toBe("8");
    expect(pWater.textContent).toBe("high");
    expect(pNutrients.textContent).toBe("medium");
    expect(pAveragePh.textContent).toBe("6.1");
  });

  test("onClick function is called when card is clicked", () => {
    const mockOnClick = vi.fn();
    const mockSetOpeningHand = vi.fn();

    render(
      <MemoryRouter>
        <Card
          plant={defaultPlant}
          onClick={mockOnClick}
          setOpeningHand={mockSetOpeningHand}
        />
      </MemoryRouter>,
    );

    const card = screen.getByRole("article");
    fireEvent.click(card);

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
        />
      </MemoryRouter>,
    );

    const card = screen.getByRole("article");
    fireEvent.click(card);

    expect(mockSetOpeningHand).toHaveBeenCalledTimes(1);
    // The mock implementation should return the updated state
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
      nutrients_required: null,
      water_required: null,
      average_pH: null,
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

    const pNutrients = screen.getByTestId("nutrients-text");
    const pWater = screen.getByTestId("water-text");
    const pAveragePh = screen.getByTestId("average-ph-text");

    expect(pNutrients.textContent).toBe("");
    expect(pWater.textContent).toBe("");
    expect(pAveragePh.textContent).toBe("");
  });
});
