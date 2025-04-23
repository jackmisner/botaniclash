package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
)

type GameStatsController struct{}

// CreateGameStats handles the creation of new game stats
func (g *GameStatsController) CreateGameStats(ctx *gin.Context) {
	var input struct {
		UserID   uint   `json:"user_id" binding:"required"`
		Username string `json:"username" binding:"required"`
	}

	// Bind JSON input
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Initialize game stats
	gameStats := &models.GameStats{
		UserID:      input.UserID,
		Username:    input.Username,
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
	// Parse user ID from URL parameter
	userID, err := strconv.ParseUint(ctx.Param("user_id"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User ID must be a number"})
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

	ctx.JSON(http.StatusOK, gin.H{"game_stats": gameStats})
}

// GetAllGameStats retrieves all game stats
func (g *GameStatsController) GetAllGameStats(ctx *gin.Context) {
	// Fetch all game stats
	gameStats, err := models.GetAllGameStats()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"game_stats": gameStats})
}
