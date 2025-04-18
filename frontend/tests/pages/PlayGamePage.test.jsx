import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PlayGamePage } from "../../src/pages/PlayGamePage/PlayGamePage";
import { vi } from "vitest";
import { expect } from "chai";

// Mock the CardContainer component
vi.mock("../../src/components/CardContainer/CardContainer", () => ({
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

// Mock the API service
vi.mock("../../src/services/plants", () => ({
  getPlants: vi.fn().mockResolvedValue({
    cards: [
      { id: 1, common_name: "Plant 1" },
      { id: 2, common_name: "Plant 2" },
      { id: 3, common_name: "Plant 3" },
      { id: 4, common_name: "Plant 4" },
      { id: 5, common_name: "Plant 5" },
      { id: 6, common_name: "Plant 6" },
      { id: 7, common_name: "Plant 7" },
      { id: 8, common_name: "Plant 8" },
      { id: 9, common_name: "Plant 9" },
      { id: 10, common_name: "Plant 10" },
      { id: 11, common_name: "Plant 11" },
      { id: 12, common_name: "Plant 12" },
      { id: 13, common_name: "Plant 13" },
      { id: 14, common_name: "Plant 14" },
      { id: 15, common_name: "Plant 15" },
      { id: 16, common_name: "Plant 16" },
    ],
  }),
  postPlantForComparison: vi.fn(),
}));

describe("PlayGamePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("displays opponent hand section after data loads", async () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    // Wait for the opponent hand to appear after data loads
    const opponentHandTitle = await waitFor(() =>
      screen.getByText("Opponent Hand"),
    );
    expect(opponentHandTitle).to.exist;
  });

  test("displays initial game UI elements after data loads", async () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    // First you'll see "Choose your opening hand" when the component first renders
    const openingHandTitle = await waitFor(() =>
      screen.getByText("Choose your opening hand"),
    );
    expect(openingHandTitle).to.exist;

    // Wait for the player to make their selection

    const cards = await waitFor(() => screen.getAllByTestId(/select-button/));
    fireEvent.click(cards[0]); // Select first card
    fireEvent.click(cards[0]); // Select second card
    fireEvent.click(cards[0]); // Select third card
    fireEvent.click(cards[0]); // Select fourth card
    fireEvent.click(cards[0]); // Select fifth card
  });

  test("renders the game UI structure correctly after data loads", async () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    // Wait for the opponent hand to appear
    const opponentHandTitle = await waitFor(() =>
      screen.getByText("Opponent Hand"),
    );
    expect(opponentHandTitle).to.exist;

    // First we'll need to select cards
    const cards = await waitFor(() => screen.getAllByTestId(/select-button/));
    fireEvent.click(cards[0]); // Select first card
    fireEvent.click(cards[0]); // Select second card
    fireEvent.click(cards[0]); // Select first card
    fireEvent.click(cards[0]); // Select second card
    fireEvent.click(cards[0]); // Select second card

    // Now we should see the Player Hand and Next Round button
    const playerHandTitle = await waitFor(() =>
      screen.getByText("Player Hand"),
    );

    expect(playerHandTitle).to.exist;
  });
});
