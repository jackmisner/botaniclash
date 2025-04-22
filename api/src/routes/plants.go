package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/controllers"
	"github.com/makersacademy/go-react-acebook-template/api/src/middleware"
)

func setupPlantRoutes(baseRouter *gin.RouterGroup) { // sets up the plant routes
	plants := baseRouter.Group("/plants") // creates a new router group for the plants route

	plants.GET("", middleware.AuthenticationMiddleware, controllers.GetAllPlants) // gets all plants
	plants.POST("", middleware.AuthenticationMiddleware, controllers.ComparePlants)
}
