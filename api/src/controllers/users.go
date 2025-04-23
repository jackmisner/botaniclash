package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
	"github.com/makersacademy/go-react-acebook-template/api/src/passwordhashing"
)

func CreateUser(ctx *gin.Context) {
	var newUser models.User
	err := ctx.BindJSON(&newUser)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if newUser.Password == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Must supply username and password"})
		return
	}

	// Hash the password before saving
	newUser.Password = passwordhashing.HashPassword(newUser.Password)

	savedUser, err := newUser.Save()
	if err != nil {
		// Return the actual error message instead of a generic one
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Create GameStats record for the user
	gameStats := models.GameStats{
		UserID:      savedUser.ID,
		GamesPlayed: 0,
		GamesWon:    0,
	}

	if err := models.Database.Create(&gameStats).Error; err != nil {
		// If we get an error creating game stats, log it but don't fail the user creation
		fmt.Printf("Error creating game stats for user %d: %v\n", savedUser.ID, err)
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "OK", "user_id": savedUser.ID})
}
