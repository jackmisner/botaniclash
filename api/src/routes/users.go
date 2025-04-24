package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/jackmisner/botaniclash/src/controllers"
)

func setupUserRoutes(baseRouter *gin.RouterGroup) {
	users := baseRouter.Group("/users")

	users.POST("", controllers.CreateUser)
}
