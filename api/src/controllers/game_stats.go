package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
)

type GameStatsController struct{} //empty struct to handle the controller methods

func (g *GameStatsController) CreateGameStats(ctx *gin.Context) {
	var input struct {
		UserID uint `json:"user_id" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	gameStats, err := models.CreateGameStats(input.UserID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{"game_stats": gameStats})
}

func (g *GameStatsController) GetGameStatsByUserID(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("user_id"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User ID must be a number"})
		return
	}
	gameStats, err := models.GetGameStatsByUserID(uint(userID))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "GameStats not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"game_stats": gameStats})
}

func (g *GameStatsController) UpdateGameStats(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("user_id"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User ID must be a number"})
		return
	}

	var input struct {
		GamesPlayed int `json:"games_played"`
		GamesWon    int `json:"games_won"`
		GamesLost   int `json:"games_lost"`
		TotalScore  int `json:"total_score"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	gameStats, err := models.UpdateGameStats(uint(userID), input.GamesPlayed, input.GamesWon, input.GamesLost, input.TotalScore)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"game_stats": gameStats})
}

func (g *GameStatsController) DeleteGameStats(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("user_id"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User ID must be a number"})
		return
	}

	err = models.DeleteGameStats(uint(userID))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "GameStats not found"})
		return
	}
	ctx.JSON(http.StatusNoContent, gin.H{"message": "GameStats deleted successfully"})
}

func (g *GameStatsController) GetAllGameStats(ctx *gin.Context) {
	gameStats, err := models.GetAllGameStats()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"game_stats": gameStats})
}