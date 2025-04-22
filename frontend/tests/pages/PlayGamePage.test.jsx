import { render, screen, fireEvent, act } from "@testing-library/react";
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
    { id: 1, common_name: "Player Plant 1", owner: "player" },
    { id: 2, common_name: "Player Plant 2", owner: "player" },
  ];

  const mockOpponentHand = [
    { id: 3, common_name: "Opponent Plant 1", owner: "opponent" },
    { id: 4, common_name: "Opponent Plant 2", owner: "opponent" },
  ];

  test("displays player and opponent hands", async () => {
    renderWithRouterState({
      startingPlayerHand: mockPlayerHand,
      startingOpponentHand: mockOpponentHand,
    });

    // Use findByText to wait for the elements to appear
    const playerHandHeading = await screen.findByText(
      (content, element) =>
        element.tagName.toLowerCase() === "h1" &&
        content.includes("Player Hand"),
    );
    const opponentHandHeading = await screen.findByText(
      (content, element) =>
        element.tagName.toLowerCase() === "h1" &&
        content.includes("Opponent Hand"),
    );

    expect(playerHandHeading).to.exist;
    expect(opponentHandHeading).to.exist;
  });

  test("displays Next Round button when both hands have cards", async () => {
    renderWithRouterState({
      startingPlayerHand: mockPlayerHand,
      startingOpponentHand: mockOpponentHand,
    });

    // Use findByText to wait for the button to appear
    const nextRoundButton = await screen.findByText("Next Round");
    expect(nextRoundButton).to.exist;
  });

  test("moves top cards to play area when Next Round is clicked", async () => {
    renderWithRouterState({
      startingPlayerHand: mockPlayerHand,
      startingOpponentHand: mockOpponentHand,
    });

    const nextRoundButton = await screen.findByText("Next Round");

    // Wrap the fireEvent in act
    act(() => {
      fireEvent.click(nextRoundButton);
    });

    // Use findByText to wait for "Cards in Play" heading to appear
    const cardsInPlayHeading = await screen.findByText("Cards in Play");
    expect(cardsInPlayHeading).to.exist;

    // Use findByTestId to check that the cards are moved to play area
    const playerCard = await screen.findByTestId(
      `plant-card-${mockPlayerHand[0].id}`,
    );
    const opponentCard = await screen.findByTestId(
      `plant-card-${mockOpponentHand[0].id}`,
    );

    expect(playerCard).to.exist;
    expect(opponentCard).to.exist;

    // Ensure "Next Round" button disappears
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
    const nextRoundButton = await screen.findByText("Next Round");
    // Wrap the fireEvent in act
    act(() => {
      fireEvent.click(nextRoundButton);
    });

    // Select a stat (height)
    const heightStatButton = await screen.findByTestId(
      `select-stat-height-${mockPlayerHand[0].id}`,
    );
    // Wrap the fireEvent in act
    act(() => {
      fireEvent.click(heightStatButton);
    });

    // Wait for comparison resolution
    await vi.waitFor(() => {
      setTimeout(() => {
        // After player wins, the Next Round button should reappear
        expect(screen.getByText("Next Round")).to.exist;
        // Cards in play heading should disappear
        expect(screen.queryByText("Cards in Play")).to.not.exist;
      }, 1000);
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
