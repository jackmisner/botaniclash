package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
	"github.com/makersacademy/go-react-acebook-template/api/src/utils"
)

type GameStatsController struct{} // Define an empty struct to act as the controller for game stats

// UpdateStatsBasedOnGameResult handles updating game stats based on the game result
func (g *GameStatsController) UpdateStatsBasedOnGameResult(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromJWT(ctx) // Extract the user ID from the JWT in the request
	if err != nil { // If there's an error extracting the user ID
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or missing JWT"}) // Respond with an unauthorized error
		return // Exit the function
	}

	var input struct { // Define a struct to parse the JSON input
		Winner string `json:"winner" binding:"required"` // Expect a "winner" field in the JSON input
	}
	// Bind the JSON input to the struct and validate the "winner" field
	if err := ctx.ShouldBindJSON(&input); err != nil || (input.Winner != "player" && input.Winner != "opponent") {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid winner"}) // Respond with a bad request error if validation fails
		return // Exit the function
	}

	isWin := input.Winner == "player" // Determine if the player won based on the "winner" field
	// Update the game stats in the database based on the result
	err = models.UpdateGameStatsBasedOnResult(userID, isWin)
	if err != nil { // If there's an error updating the stats
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}) // Respond with an internal server error
		return // Exit the function
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Game stats updated"}) // Respond with a success message
}

// GetAllGameStats handles retrieving all game stats
func (g *GameStatsController) GetAllGameStats(ctx *gin.Context) {
	stats, err := models.GetAllGameStats() // Fetch all game stats from the database
	if err != nil { // If there's an error fetching the stats
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}) // Respond with an internal server error
		return // Exit the function
	}
	ctx.JSON(http.StatusOK, gin.H{"game_stats": stats}) // Respond with the retrieved game stats
}