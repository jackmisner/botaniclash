import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getPlants,
  postPlantForComparison,
} from "../../src/services/plants.js";

// Mock the environment variable
vi.stubGlobal("import.meta", {
  env: {
    VITE_BACKEND_URL: "http://localhost:8082/",
  },
});

describe("Plants API Functions", () => {
  // Set up fetch mock
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getPlants", () => {
    it("should fetch plants successfully", async () => {
      // Mock data
      const mockPlants = [
        { id: 1, name: "Venus Flytrap", attack: 5, defense: 3 },
        { id: 2, name: "Cactus", attack: 3, defense: 7 },
      ];

      // Mock fetch response
      global.fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockPlants,
      });

      // Call the function
      const result = await getPlants();

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8082/plants",
        {
          method: "GET",
          headers: {},
        },
      );
      expect(result).toEqual(mockPlants);
    });

    it("should throw an error when fetch fails", async () => {
      // Mock fetch response for error case
      global.fetch.mockResolvedValueOnce({
        status: 500,
        json: async () => ({ message: "Server error" }),
      });

      // Expect the function to throw an error
      await expect(getPlants()).rejects.toThrow("Unable to fetch plants");
    });
  });

  describe("postPlantForComparison", () => {
    it("should post comparison data and return winner", async () => {
      // Mock data
      const playerCardId = "123";
      const opponentCardId = "456";
      const statToCompare = "attack";
      const expectedWinner = "player";

      // Mock fetch response
      global.fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ winner: expectedWinner }),
      });

      // Call the function
      const result = await postPlantForComparison(
        playerCardId,
        opponentCardId,
        statToCompare,
      );

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8082/plants",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            player_card: playerCardId,
            opponent_card: opponentCardId,
            stat_to_compare: statToCompare,
          }),
        },
      );
      expect(result).toEqual(expectedWinner);
    });

    it("should throw an error when comparison post fails", async () => {
      // Mock fetch response for error case
      global.fetch.mockResolvedValueOnce({
        status: 400,
        json: async () => ({ message: "Bad request" }),
      });

      // Expect the function to throw an error
      await expect(
        postPlantForComparison("123", "456", "attack"),
      ).rejects.toThrow("Unable to send cards to compare");
    });

    it("should properly format the request body", async () => {
      // Mock successful response
      global.fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ winner: "opponent" }),
      });

      // Call function with test data
      const playerCardId = "player123";
      const opponentCardId = "opponent456";
      const statToCompare = "defense";

      await postPlantForComparison(playerCardId, opponentCardId, statToCompare);

      // Check the request body was formatted correctly
      const expectedBody = JSON.stringify({
        player_card: playerCardId,
        opponent_card: opponentCardId,
        stat_to_compare: statToCompare,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expectedBody,
        }),
      );
    });
  });
});
