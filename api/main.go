package main

import (
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackmisner/botaniclash/src/env"
	"github.com/jackmisner/botaniclash/src/models"
	"github.com/jackmisner/botaniclash/src/routes"
	"github.com/jackmisner/botaniclash/src/seeds"
)

func main() {
	// Load environment variables
	env.LoadEnv()

	// Set Gin to release mode to hide messy/unhelpful debug logs when running "go run main.go"
	gin.SetMode(gin.ReleaseMode) // Comment this out to see debug logs

	// Setup the application
	app := setupApp()

	// Open the database connection
	models.OpenDatabaseConnection()

	// Check if the seed argument is provided
	// if so, reseed the database
	args := os.Args[1:]
	for _, arg := range args {
		if arg == "seed" {
			seeds.Reseed(models.Database)
			return // Exit after seeding
		} else if len(args) > 0 {
			fmt.Println("INCORRECT COMMAND LINE ARGUMENT, did you mean 'seed'?")
			return
		}
	}

	// Migrate the database
	models.AutoMigrateModels()

	// Start the server
	app.Run(":8082")
}

func setupApp() *gin.Engine {
	app := gin.Default()
	setupCORS(app)
	routes.SetupRoutes(app)
	return app
}

func setupCORS(app *gin.Engine) {
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"}

	app.Use(cors.New(config))
}
