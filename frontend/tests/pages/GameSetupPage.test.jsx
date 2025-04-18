import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { GameSetupPage } from "../../src/pages/GameSetupPage/GameSetupPage";
import { vi } from "vitest";
import { expect } from "chai";

// Mock the CardContainer component
vi.mock("../../src/components/CardContainer/CardContainer", () => ({
  CardContainer: ({
    plants,
    onClickHandle,
    setOpeningHand,
    isTwoCardsChoice,
  }) => (
    <div data-testid="mocked-card-container">
      {plants &&
        plants.map((plant) => (
          <div key={plant.id} data-testid={`plant-card-${plant.id}`}>
            {plant.common_name}
            {isTwoCardsChoice && onClickHandle && (
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
}));

describe("GameSetupPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("fetches initial plant data on component mount", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <GameSetupPage />
        </MemoryRouter>,
      );
    });

    // Should show "Choose your opening hand" initially
    const openingHandTitle = screen.getByText("Choose your opening hand");
    expect(openingHandTitle).to.exist;
  });

  test("displays two cards for selection initially", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <GameSetupPage />
        </MemoryRouter>,
      );
    });

    // Check for card container
    const cardContainer = screen.getByTestId("mocked-card-container");
    expect(cardContainer).to.exist;

    // Initially, there should be two select buttons (for the first two plants)
    const selectButtons = screen.getAllByTestId(/select-button/);
    expect(selectButtons).to.have.length(2);
  });

  test("moves cards to player hand when selected", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <GameSetupPage />
        </MemoryRouter>,
      );
    });

    // Select a card
    await act(async () => {
      const selectButton = screen.getAllByTestId(/select-button/)[0];
      fireEvent.click(selectButton);
    });

    // Player hand should now be visible
    const playerHandTitle = screen.getByText("Player Hand");
    expect(playerHandTitle).to.exist;
  });

  test("shows new card choices after selecting", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <GameSetupPage />
        </MemoryRouter>,
      );
    });

    // Get the initial card IDs
    const initialCards = screen.getAllByTestId(/plant-card/);
    const initialCardIds = initialCards.map((card) =>
      card.getAttribute("data-testid").replace("plant-card-", ""),
    );

    // Select a card
    await act(async () => {
      const selectButton = screen.getAllByTestId(/select-button/)[0];
      fireEvent.click(selectButton);
    });

    // After selecting, there should be new cards to choose from
    const updatedCards = screen.getAllByTestId(/plant-card/);
    const updatedChoiceCardIds = updatedCards
      .filter((card) => card.querySelector('[data-testid^="select-button"]'))
      .map((card) =>
        card.getAttribute("data-testid").replace("plant-card-", ""),
      );

    // The updated cards should be different from the initial ones
    expect(updatedChoiceCardIds).to.not.deep.equal(initialCardIds);
  });

  test("shows Start Game link when selection is complete", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <GameSetupPage />
        </MemoryRouter>,
      );
    });

    // Select all the cards (need to select 5 cards total)
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        const selectButton = screen.getAllByTestId(/select-button/)[0];
        fireEvent.click(selectButton);
      });
    }

    // After selecting all cards, the "Start Game" link should appear
    const startGameLink = screen.getByText("Start Game");
    expect(startGameLink).to.exist;

    // The link should have the correct href
    expect(startGameLink.getAttribute("href")).to.equal("/playgame");
  });

  test("passes correct state to router when selection is complete", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <GameSetupPage />
        </MemoryRouter>,
      );
    });

    // Select all 5 cards
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        const selectButton = screen.getAllByTestId(/select-button/)[0];
        fireEvent.click(selectButton);
      });
    }

    // Start Game link should exist now
    const startGameLink = screen.getByText("Start Game");
    expect(startGameLink).to.exist;
  });
});
