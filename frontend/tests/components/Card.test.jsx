import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Card } from "../../src/components/Card/Card";

describe("Card", () => {
  test("card displays correct measures", () => {
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
    ];

    render(
      <MemoryRouter>
        <Card plant={mockPlants[0]} />
      </MemoryRouter>,
    );

    const pCommonName = screen.getByTestId("common-name");
    const pScientificName = screen.getByTestId("scientific-name");
    const pImageUrl = screen.getByTestId("image-url");
    const pYear = screen.getByTestId("year");
    const pEdible = screen.getByTestId("edible");
    const pLight = screen.getByTestId("light");
    const pWater = screen.getByTestId("water-required");
    const pNutrients = screen.getByTestId("nutrients-required");
    const pAveragePh = screen.getByTestId("average-ph");
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
});
