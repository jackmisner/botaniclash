package controllers_test

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/jackmisner/botaniclash/src/auth"
	"github.com/jackmisner/botaniclash/src/controllers"
	"github.com/jackmisner/botaniclash/src/middleware"
	"github.com/jackmisner/botaniclash/src/models"
	"github.com/jackmisner/botaniclash/src/passwordhashing"
	"github.com/stretchr/testify/assert"
)

func TestGetAllGameStats(t *testing.T) {
	// ========= Part 1 - Set-up =========
	// 1) Create a test Gin router
	router := gin.Default()

	// 2) Setup route without authentication middleware
	gameStatsController := &controllers.GameStatsController{}
	router.GET("/game_stats", gameStatsController.GetAllGameStats)

	// 3) Create test users and their game stats
	user1 := models.User{
		Username: "testuser1",
		Password: passwordhashing.HashPassword("password123"),
	}
	user2 := models.User{
		Username: "testuser2",
		Password: passwordhashing.HashPassword("password123"),
	}
	models.Database.Create(&user1)
	models.Database.Create(&user2)

	gameStats1 := models.GameStats{
		UserID:      user1.ID,
		GamesPlayed: 5,
		GamesWon:    3,
	}
	gameStats2 := models.GameStats{
		UserID:      user2.ID,
		GamesPlayed: 10,
		GamesWon:    4,
	}
	models.Database.Create(&gameStats1)
	models.Database.Create(&gameStats2)

	// 4) Create a new HTTP request
	req, _ := http.NewRequest("GET", "/game_stats", nil)

	// 5) Create a new HTTP recorder
	w := httptest.NewRecorder()

	// 6) Serve the request through the router
	router.ServeHTTP(w, req)

	// ======= Part 2 - Assertions =======
	// Check the response status code is 200
	assert.Equal(t, http.StatusOK, w.Code, "GET /game_stats should return a 200 status code")

	// Parse the response
	var response struct {
		GameStats []controllers.GameStatsResponse `json:"game_stats"`
	}
	err := json.NewDecoder(w.Body).Decode(&response)
	assert.NoError(t, err)

	// Verify that our test game stats are included in the response
	assert.GreaterOrEqual(t, len(response.GameStats), 2, "Response should have at least our 2 created game stats")

	// Check that both test users' game stats are in the response
	foundUser1Stats := false
	foundUser2Stats := false

	for _, stats := range response.GameStats {
		if stats.UserID == user1.ID && stats.Username == "testuser1" && stats.GamesPlayed == 5 && stats.GamesWon == 3 {
			foundUser1Stats = true
		}
		if stats.UserID == user2.ID && stats.Username == "testuser2" && stats.GamesPlayed == 10 && stats.GamesWon == 4 {
			foundUser2Stats = true
		}
	}

	assert.True(t, foundUser1Stats, "Response should include user1's game stats")
	assert.True(t, foundUser2Stats, "Response should include user2's game stats")
}

func TestUpdateGameStats(t *testing.T) {
	// ========= Part 1 - Set-up =========
	// 1) Create a test Gin router
	router := gin.Default()

	// 2) Setup route with authentication middleware
	gameStatsController := &controllers.GameStatsController{}
	router.POST("/game_stats", middleware.AuthenticationMiddleware, gameStatsController.UpdateGameStats)

	// 3) Create a test user and generate JWT token
	testUser := models.User{
		Username: "gamestatsuser",
		Password: passwordhashing.HashPassword("password123"),
	}
	models.Database.Create(&testUser)

	// Create initial game stats for the user
	initialStats := models.GameStats{
		UserID:      testUser.ID,
		GamesPlayed: 1,
		GamesWon:    0,
	}
	models.Database.Create(&initialStats)

	// Generate JWT token for the user
	testUserID := testUser.ID
	token, err := auth.GenerateToken(fmt.Sprintf("%d", testUserID))
	assert.NoError(t, err, "Failed to generate token")

	// 4) Create request body for updating game stats
	requestBody := `{
		"winner": "player"
	}`

	// 5) Create a new HTTP request & add the JWT token to the Authorization header
	req, _ := http.NewRequest("POST", "/game_stats", strings.NewReader(requestBody))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	// 6) Create a new HTTP recorder
	w := httptest.NewRecorder()

	// 7) Serve the request through the router
	router.ServeHTTP(w, req)

	// ======= Part 2 - Assertions =======
	// Check the response status code is 200
	assert.Equal(t, http.StatusOK, w.Code, "POST /game_stats should return a 200 status code")

	// Parse the response
	var response struct {
		GameStats controllers.GameStatsResponse `json:"game_stats"`
	}
	err = json.NewDecoder(w.Body).Decode(&response)
	assert.NoError(t, err)

	// Check that the game stats were updated correctly
	// GamesPlayed should increase by 1
	assert.Equal(t, 2, response.GameStats.GamesPlayed, "Games played should be incremented by 1")
	// GamesWon should increase by 1 since winner is "player"
	assert.Equal(t, 1, response.GameStats.GamesWon, "Games won should be incremented by 1")
	// UserID should match the test user's ID
	assert.Equal(t, testUser.ID, response.GameStats.UserID, "UserID should match the test user's ID")
	// Username should match the test user's username
	assert.Equal(t, "gamestatsuser", response.GameStats.Username, "Username should match the test user's username")

	// Test with "opponent" as winner
	requestBody = `{
		"winner": "opponent"
	}`

	req, _ = http.NewRequest("POST", "/game_stats", strings.NewReader(requestBody))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code, "POST /game_stats should return a 200 status code")
	err = json.NewDecoder(w.Body).Decode(&response)
	assert.NoError(t, err)

	// GamesPlayed should increase by 1 again
	assert.Equal(t, 3, response.GameStats.GamesPlayed, "Games played should be incremented by 1")
	// GamesWon should remain the same since winner is "opponent"
	assert.Equal(t, 1, response.GameStats.GamesWon, "Games won should remain the same")
}
