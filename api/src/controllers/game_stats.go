package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackmisner/botaniclash/src/models"
)

type GameStatsController struct{}

// GameStatsResponse is a simplified struct with only the required fields
type GameStatsResponse struct {
	UserID      uint   `json:"UserID"`
	Username    string `json:"Username"`
	GamesPlayed int    `json:"GamesPlayed"`
	GamesWon    int    `json:"GamesWon"`
}

// CreateGameStats handles the creation of new game stats
func (g *GameStatsController) CreateGameStats(ctx *gin.Context) {
	var input struct {
		UserID uint `json:"user_id" binding:"required"`
	}

	// Bind JSON input
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Initialise game stats
	gameStats := &models.GameStats{
		UserID:      input.UserID,
		GamesPlayed: 0,
		GamesWon:    0,
	}

	// Save to database
	if err := models.Database.Create(gameStats).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"game_stats": gameStats})
}

// UpdateGameStats updates game stats for a specific user
func (g *GameStatsController) UpdateGameStats(ctx *gin.Context) {
	// Extract userID from the context (set by AuthenticationMiddleware)
	val, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User ID not found in token"})
		return
	}

	// Convert string userID to uint
	userIDStr := val.(string)
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	var input struct {
		Winner string `json:"winner" binding:"required,oneof=player opponent"`
	}

	// Bind JSON input
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update game stats
	gameStats, err := models.UpdateGameStats(uint(userID), input.Winner)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Get the username from the User model
	user, err := models.FindUser(userIDStr)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get username"})
		return
	}

	// Create response
	statsResponse := GameStatsResponse{
		UserID:      gameStats.UserID,
		Username:    user.Username,
		GamesPlayed: gameStats.GamesPlayed,
		GamesWon:    gameStats.GamesWon,
	}

	ctx.JSON(http.StatusOK, gin.H{"game_stats": statsResponse})
}

// GetAllGameStats retrieves all game stats
func (g *GameStatsController) GetAllGameStats(ctx *gin.Context) {
	// Fetch all game stats
	gameStats, err := models.GetAllGameStats()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Create a slice to hold game stats responses
	statsResponse := make([]GameStatsResponse, 0, len(gameStats))

	// For each game stat, get the corresponding username
	for _, stats := range gameStats {
		userIDStr := strconv.FormatUint(uint64(stats.UserID), 10)
		user, err := models.FindUser(userIDStr)

		// If user is found, add the game stats with username to response
		if err == nil {
			statsResponse = append(statsResponse, GameStatsResponse{
				UserID:      stats.UserID,
				Username:    user.Username,
				GamesPlayed: stats.GamesPlayed,
				GamesWon:    stats.GamesWon,
			})
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"game_stats": statsResponse})
}
