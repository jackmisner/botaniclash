package routes

import "github.com/gin-gonic/gin"

func SetupRoutes(engine *gin.Engine) {
	apiRouter := engine.Group("/")
	setupPlantRoutes(apiRouter) // sets up the plant routes
	setupUserRoutes(apiRouter)
	setupPostRoutes(apiRouter)
	setupGameStatsRoutes(apiRouter)
	setupAuthenticationRoutes(apiRouter)
}
