package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/controllers"
)

func setupPlantRoutes(baseRouter *gin.RouterGroup) { // sets up the plant routes
	plants := baseRouter.Group("/plants") // creates a new router group for the plants route

	plants.GET("", controllers.GetAllPlants) // gets all plants (no auth required yet, but will be soon)
}
