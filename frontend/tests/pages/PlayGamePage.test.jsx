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

    const testTopCardsButton = screen.getByText("Next Round");

    expect(testTopCardsButton).to.exist;
  });

  test("renders the game UI structure correctly", () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    // Check for main UI elements

    expect(screen.getByText("Opponent hand")).to.exist;
    expect(screen.getByText("Next Round")).to.exist;
  });
});
