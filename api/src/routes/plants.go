package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/jackmisner/botaniclash/src/controllers"
	"github.com/jackmisner/botaniclash/src/middleware"
)

func setupPlantRoutes(baseRouter *gin.RouterGroup) {
	plants := baseRouter.Group("/plants")

	plants.GET("", middleware.AuthenticationMiddleware, controllers.GetAllPlants)
	plants.POST("", middleware.AuthenticationMiddleware, controllers.ComparePlants)
}
