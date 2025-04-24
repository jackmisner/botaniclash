package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/jackmisner/botaniclash/src/controllers"
	"github.com/jackmisner/botaniclash/src/middleware"
)

func setupGameStatsRoutes(baseRouter *gin.RouterGroup) {
	gameStatsController := &controllers.GameStatsController{}
	gameStats := baseRouter.Group("/game_stats")

	gameStats.POST("", middleware.AuthenticationMiddleware, gameStatsController.UpdateGameStats)
	gameStats.GET("", gameStatsController.GetAllGameStats)
}
