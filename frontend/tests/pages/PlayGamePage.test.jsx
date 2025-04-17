import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PlayGamePage } from "../../src/pages/PlayGamePage/PlayGamePage";
import { vi } from "vitest";
import { expect } from "chai";

// Mock the CardContainer component
vi.mock("../../components/CardContainer/CardContainer", () => ({
  CardContainer: ({ plants, onClickHandle, setOpeningHand }) => (
    <div data-testid="mocked-card-container">
      {plants &&
        plants.map((plant) => (
          <div key={plant.id} data-testid={`plant-card-${plant.id}`}>
            {plant.common_name}
            {onClickHandle && (
              <button
                data-testid={`select-button-${plant.id}`}
                onClick={() => {
                  onClickHandle();
                  if (setOpeningHand) {
                    setOpeningHand((prev) => [...prev, plant]);
                  }
                }}
              >
                Select
              </button>
            )}
          </div>
        ))}
    </div>
  ),
}));

describe("PlayGamePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("playGamePage displays correct title", () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    const h1PlayGamePageTitle = screen.getByTestId("play-game");
    expect(h1PlayGamePageTitle.textContent).to.equal("Play game");
  });

  test("displays opponent hand section", () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    const opponentHandTitle = screen.getByText("Opponent hand");
    expect(opponentHandTitle).to.exist;
  });

  test("displays initial game buttons", () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    const testTopCardsButton = screen.getByText("Test top cards");
    const player1WinsButton = screen.getByText("Player 1 wins comparison");
    const player2WinsButton = screen.getByText("Player 2 wins comparison");

    expect(testTopCardsButton).to.exist;
    expect(player1WinsButton).to.exist;
    expect(player2WinsButton).to.exist;
  });

  test("handles click on Player 1 wins comparison button", () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    const player1WinsButton = screen.getByText("Player 1 wins comparison");
    fireEvent.click(player1WinsButton);

    // Verify the component doesn't crash
    expect(player1WinsButton).to.exist;
  });

  test("handles click on Player 2 wins comparison button", () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    const player2WinsButton = screen.getByText("Player 2 wins comparison");
    fireEvent.click(player2WinsButton);

    // Verify the component doesn't crash
    expect(player2WinsButton).to.exist;
  });

  test("renders the game UI structure correctly", () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    // Check for main UI elements
    expect(screen.getByTestId("play-game")).to.exist;
    expect(screen.getByText("Opponent hand")).to.exist;
    expect(screen.getByText("Test top cards")).to.exist;
  });
});
