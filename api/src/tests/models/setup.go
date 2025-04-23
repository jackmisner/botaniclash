package models_test

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func SetupTestDatabase() error {
	// Load environment variables from .env.test (from the root of api/)
	err := godotenv.Load("../../../.env.test")
	if err != nil {
		return err
	}

	// Get the POSTGRES_URL from environment variables
	connString := os.Getenv("POSTGRES_URL")
	db, err := gorm.Open(postgres.Open(connString), &gorm.Config{})
	if err != nil {
		return err
	}
	models.Database = db

	// Run migrations
	models.AutoMigrateModels()

	return nil
}

func TeardownTestDatabase() error {
	var tableNames []string

	// Query to get all table names in the current database (PostgreSQL syntax)
	models.Database.Raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'").Scan(&tableNames)

	// Iterate over each table name and drop it
	for _, tableName := range tableNames {
		models.Database.Exec("DROP TABLE IF EXISTS " + tableName + " CASCADE")
	}

	return nil
}
