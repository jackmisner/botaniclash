package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/controllers"
)

func setupGameStatsRoutes(baseRouter *gin.RouterGroup) {
	gameStatsController := &controllers.GameStatsController{}
	gameStats := baseRouter.Group("/game_stats")

	gameStats.POST("", gameStatsController.CreateGameStats)
	gameStats.GET("/:user_id", gameStatsController.GetGameStatsByUserID)
	gameStats.PUT("/:user_id", gameStatsController.UpdateGameStats)
	gameStats.DELETE("/:user_id", gameStatsController.DeleteGameStats)
	gameStats.GET("", gameStatsController.GetAllGameStats)
}