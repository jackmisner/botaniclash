package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/controllers"
	"github.com/makersacademy/go-react-acebook-template/api/src/middleware"
)

func setupGameStatsRoutes(baseRouter *gin.RouterGroup) {
	gameStatsController := &controllers.GameStatsController{}
	gameStats := baseRouter.Group("/game_stats")

	gameStats.POST("", middleware.AuthenticationMiddleware, gameStatsController.UpdateGameStats)
	gameStats.GET("", gameStatsController.GetAllGameStats)
}
