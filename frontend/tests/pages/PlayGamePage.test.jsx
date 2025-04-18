import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PlayGamePage } from "../../src/pages/PlayGamePage/PlayGamePage";
import { vi } from "vitest";
import { expect } from "chai";
import * as plantsService from "../../src/services/plants";

// Mock the CardContainer component
vi.mock("../../src/components/CardContainer/CardContainer", () => ({
  CardContainer: ({ plants, isCardInPlay, selectStat }) => (
    <div data-testid="mocked-card-container">
      {plants &&
        plants.map((plant) => (
          <div key={plant.id} data-testid={`plant-card-${plant.id}`}>
            {plant.common_name}
            {isCardInPlay && selectStat && (
              <div>
                <button
                  data-testid={`select-stat-height-${plant.id}`}
                  onClick={() => selectStat("height")}
                >
                  Height
                </button>
                <button
                  data-testid={`select-stat-width-${plant.id}`}
                  onClick={() => selectStat("width")}
                >
                  Width
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  ),
}));

// Mock the API service
vi.mock("../../src/services/plants", () => ({
  postPlantForComparison: vi.fn().mockResolvedValue("player"),
}));

// Mock route location state setup
const renderWithRouterState = (initialState) => {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: "/playgame", state: initialState }]}
    >
      <Routes>
        <Route path="/playgame" element={<PlayGamePage />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("PlayGamePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPlayerHand = [
    { id: 1, common_name: "Player Plant 1", owner: " player" },
    { id: 2, common_name: "Player Plant 2", owner: " player" },
  ];

  const mockOpponentHand = [
    { id: 3, common_name: "Opponent Plant 1", owner: " opponent" },
    { id: 4, common_name: "Opponent Plant 2", owner: " opponent" },
  ];

  test("displays player and opponent hands", () => {
    renderWithRouterState({
      startingPlayerHand: mockPlayerHand,
      startingOpponentHand: mockOpponentHand,
    });

    expect(screen.getByText("Player Hand")).to.exist;
    expect(screen.getByText("Opponent Hand")).to.exist;
  });

  test("displays Next Round button when both hands have cards", () => {
    renderWithRouterState({
      startingPlayerHand: mockPlayerHand,
      startingOpponentHand: mockOpponentHand,
    });

    const nextRoundButton = screen.getByText("Next Round");
    expect(nextRoundButton).to.exist;
  });

  test("moves top cards to play area when Next Round is clicked", () => {
    renderWithRouterState({
      startingPlayerHand: mockPlayerHand,
      startingOpponentHand: mockOpponentHand,
    });

    const nextRoundButton = screen.getByText("Next Round");
    fireEvent.click(nextRoundButton);

    // Check that "Cards in Play" heading appears
    expect(screen.getByText("Cards in Play")).to.exist;

    // Check that the cards are moved to play area
    expect(screen.getByTestId(`plant-card-${mockPlayerHand[0].id}`)).to.exist;
    expect(screen.getByTestId(`plant-card-${mockOpponentHand[0].id}`)).to.exist;

    // Next Round button should disappear when cards are in play
    expect(screen.queryByText("Next Round")).to.not.exist;
  });

  test("lets player select a stat when cards are in play", async () => {
    // Set up the mock to return "player" for this specific test
    plantsService.postPlantForComparison.mockResolvedValueOnce("player");

    renderWithRouterState({
      startingPlayerHand: mockPlayerHand,
      startingOpponentHand: mockOpponentHand,
    });

    // Move cards to play area
    const nextRoundButton = screen.getByText("Next Round");
    fireEvent.click(nextRoundButton);

    // Select a stat (height)
    const heightStatButton = screen.getByTestId(
      `select-stat-height-${mockPlayerHand[0].id}`,
    );
    fireEvent.click(heightStatButton);

    // Wait for comparison resolution
    await vi.waitFor(() => {
      // After player wins, the Next Round button should reappear
      expect(screen.getByText("Next Round")).to.exist;
      // Cards in play heading should disappear
      expect(screen.queryByText("Cards in Play")).to.not.exist;
    });
  });

  test("handles empty initial state gracefully", () => {
    renderWithRouterState(null);

    // Should render without errors but no hands should be visible
    expect(screen.queryByText("Player Hand")).to.not.exist;
    expect(screen.queryByText("Opponent Hand")).to.not.exist;
    expect(screen.queryByText("Next Round")).to.not.exist;
  });
});
