import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Card } from "../../src/components/Card/Card";

describe("Card", () => {
    test("card displays correct measures", () => {
        const mockPlants = [
            {
                id: 1,
                common_name: "common_plant_1",
                scientific_name: "scientific_plant_1",
                image_url:
                    "https://bs.plantnet.org/image/o/17d00178e56cefcd5607668824c7a52f5b3a831a",
                year: "1990",
                edible: "Yes",
                light: "9",
                growth_rate: "Slow",
                nitrogen_fixation: null,
                average_height: "100",
            },
        ];

        render(
            <MemoryRouter>
                <Card plant={mockPlants[0]} />
            </MemoryRouter>
        );

        const pCommonName = screen.getByTestId("common-name");
        const pScientificName = screen.getByTestId("scientific-name");
        const pImageUrl = screen.getByTestId("image-url");
        const pYear = screen.getByTestId("year");
        const pEdible = screen.getByTestId("edible");
        const pLight = screen.getByTestId("light");
        const pGrowthRate = screen.getByTestId("growth-rate");
        const pNitrogen = screen.getByTestId("nitrogen");
        const pAverageHeight = screen.getByTestId("average-height");
        expect(pCommonName.textContent).toBe("common_plant_1");
        expect(pScientificName.textContent).toBe("scientific_plant_1");
        expect(pImageUrl.src).toBe(
            "https://bs.plantnet.org/image/o/17d00178e56cefcd5607668824c7a52f5b3a831a"
        );
        expect(pYear.textContent).toBe("1990");
        expect(pEdible.textContent).toBe("Yes");
        expect(pLight.textContent).toBe("9");
        expect(pGrowthRate.textContent).toBe("Slow");
        expect(pNitrogen.textContent).toBe("");
        expect(pAverageHeight.textContent).toBe("100");
    });
});
