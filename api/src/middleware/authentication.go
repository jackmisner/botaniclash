package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/auth"
)

func AuthenticationMiddleware(ctx *gin.Context) {

	// If no auth header is provided
	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" {
		ctx.JSON(401, gin.H{"error": "Authorization header with JWT token is required"})
		ctx.Abort()
		return
	}

	// If auth header is provided, extract the token
	tokenString := authHeader[7:]

	// If token is invalid, return 401
	token, err := auth.DecodeToken(tokenString)
	if err != nil {
		ctx.JSON(401, gin.H{"error": "Invalid token"})
		ctx.Abort()
		return
	}

	// If token is valid, set the userID in the context
	ctx.Set("userID", token.UserID)

	// Continue to the next middleware
	ctx.Next()
}
