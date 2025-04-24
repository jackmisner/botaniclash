package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackmisner/botaniclash/src/auth"
	"github.com/jackmisner/botaniclash/src/models"
	"github.com/jackmisner/botaniclash/src/passwordhashing"
)

type CreateTokenRequestBody struct {
	Username string
	Password string
}

func CreateToken(ctx *gin.Context) {
	var input CreateTokenRequestBody
	err := ctx.ShouldBindJSON(&input)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	}

	fmt.Println(input)

	user, err := models.FindUserByUsername(input.Username)
	if err != nil {
		SendInternalError(ctx, err)
	}

	if !passwordhashing.VerifyPassword(user.Password, input.Password) {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "Password incorrect"})
		return
	}

	token, err := auth.GenerateToken(fmt.Sprintf("%d", user.ID))
	if err != nil {
		SendInternalError(ctx, err)
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{"message": "OK", "token": token})
}
