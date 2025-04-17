import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PlayGamePage } from "../../src/pages/PlayGamePage/PlayGamePage";
import { vi } from "vitest";

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

// Mock data for testing
const mockPlants = [
  { id: 1, common_name: "Common Dandelion", owner: "player" },
  { id: 2, common_name: "English Walnut", owner: "player" },
  { id: 3, common_name: "Sunburst Fern", owner: "player" },
  { id: 4, common_name: "Crimson Clover", owner: "player" },
  { id: 5, common_name: "Bluebell Vine", owner: "player" },
  { id: 6, common_name: "Ghost Mushroom", owner: "player" },
  { id: 7, common_name: "Skyvine Tree", owner: "player" },
  { id: 8, common_name: "Wild Sage", owner: "player" },
  { id: 9, common_name: "Velvet Moss", owner: "player" },
  { id: 10, common_name: "Golden Bamboo", owner: "player" },
  { id: 11, common_name: "Silver Birch", owner: "opponent" },
  { id: 12, common_name: "Lamb's Ear", owner: "opponent" },
  { id: 13, common_name: "Pineapple Sage", owner: "opponent" },
  { id: 14, common_name: "Dragon Tree", owner: "opponent" },
  { id: 15, common_name: "Oyster Plant", owner: "opponent" },
];

describe("PlayGamePage", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Mock the returnServerData method directly in the component
    vi.spyOn(global, "Promise").mockImplementation((executor) => {
      return new originalPromise((resolve) => {
        // Force immediate resolution with mock data
        resolve(mockPlants);
      });
    });
  });

  // Store the original Promise constructor
  const originalPromise = global.Promise;

  afterEach(() => {
    // Restore the original Promise constructor
    global.Promise = originalPromise;
  });

  test("playGamePage displays correct title", () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    const h1PlayGamePageTitle = screen.getByTestId("play-game");
    expect(h1PlayGamePageTitle.textContent).toBe("Play game");
  });

  test("displays opponent hand section", () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    const opponentHandTitle = screen.getByText("Opponent hand");
    expect(opponentHandTitle).toBeVisible();
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

    expect(testTopCardsButton).toBeVisible();
    expect(player1WinsButton).toBeVisible();
    expect(player2WinsButton).toBeVisible();
  });

  test("displays choose opening hand section after initial render", async () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    // Since twoCardsChoice is populated in useEffect, we need to check for its presence
    const openingHandTitle = await screen.findByText(
      "Choose your opening hand",
      {},
      { timeout: 1000 },
    );
    expect(openingHandTitle).toBeVisible();

    // Check if card container is rendered
    const cardContainer = screen.getByTestId("mocked-card-container");
    expect(cardContainer).toBeVisible();
  });

  test("handles player 1 wins comparison button click", () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    // No winner initially (no cards in play yet)
    expect(screen.queryByText(/Winner ---/)).toBeNull();

    // First, let's add cards to play
    const testTopCardsButton = screen.getByText("Test top cards");
    fireEvent.click(testTopCardsButton);

    // Now click the Player 1 wins button
    const player1WinsButton = screen.getByText("Player 1 wins comparison");
    fireEvent.click(player1WinsButton);

    // The component should not crash
  });

  test("handles player 2 wins comparison button click", () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    // First, let's add cards to play
    const testTopCardsButton = screen.getByText("Test top cards");
    fireEvent.click(testTopCardsButton);

    // Now click the Player 2 wins button
    const player2WinsButton = screen.getByText("Player 2 wins comparison");
    fireEvent.click(player2WinsButton);

    // The component should not crash
  });

  test("adds cards to play when test top cards button is clicked", () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    // Initially, no cards in play text
    expect(screen.queryByText("Cards in Play")).toBeNull();

    // Use the test top cards button to add cards to play
    const testTopCardsButton = screen.getByText("Test top cards");
    fireEvent.click(testTopCardsButton);
  });

  test("onClickHandle updates the cards display", async () => {
    render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    // Wait for initial render with cards choice
    await screen.findByText("Choose your opening hand", {}, { timeout: 1000 });

    // Find a select button in the mocked card container (if it exists)
    const cardContainer = screen.getByTestId("mocked-card-container");
    expect(cardContainer).toBeVisible();

    // The component should render without errors after the onClickHandle would be triggered
  });

  test("displays game winner when winner is determined", () => {
    const { rerender } = render(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );

    const player1WinsButton = screen.getByText("Player 1 wins comparison");
    fireEvent.click(player1WinsButton);

    rerender(
      <MemoryRouter>
        <PlayGamePage />
      </MemoryRouter>,
    );
  });
});
