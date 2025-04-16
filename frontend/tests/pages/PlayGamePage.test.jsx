import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PlayGamePage } from "../../src/pages/PlayGamePage/PlayGamePage";

describe("PlayGamePage", () => {
    test("playGamePage displays correct data", () => {
        render(
            <MemoryRouter>
                <PlayGamePage />
            </MemoryRouter>
        );

        const h1PlayGamePageTitle = screen.getByTestId("play-game");

        expect(h1PlayGamePageTitle.textContent).toBe("Play game");
    });
});
