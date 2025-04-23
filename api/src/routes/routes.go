package routes

import "github.com/gin-gonic/gin"

func SetupRoutes(engine *gin.Engine) {
	apiRouter := engine.Group("/")
	setupPlantRoutes(apiRouter)
	setupUserRoutes(apiRouter)
	setupGameStatsRoutes(apiRouter)
	setupAuthenticationRoutes(apiRouter)
}
