package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/jackmisner/botaniclash/src/controllers"
)

func setupAuthenticationRoutes(baseRouter *gin.RouterGroup) {
	tokensRouter := baseRouter.Group("/tokens")

	tokensRouter.POST("", controllers.CreateToken)
}
