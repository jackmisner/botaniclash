package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
)

func CreateUser(ctx *gin.Context) {
	var newUser models.User
	err := ctx.BindJSON(&newUser)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if newUser.Password == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Must supply username and password"})
		return
	}

	savedUser, err := newUser.Save()
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	gameStats := models.GameStats{
		UserID:   savedUser.ID,
		Username: savedUser.Username,
	}
	if err := models.Database.Create(&gameStats).Error; err != nil {
		SendInternalError(ctx, err)
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "OK"})
}
