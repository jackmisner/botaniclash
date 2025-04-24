package models_test

import (
	"fmt"
	"os"

	"github.com/jackmisner/botaniclash/src/models"
	"github.com/joho/godotenv"
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

	// Get current database connection
	sqlDB, err := models.Database.DB()
	if err != nil {
		return err
	}

	// Check connection
	err = sqlDB.Ping()
	if err != nil {
		return err
	}

	// Run migrations
	models.AutoMigrateModels()

	// Verify that critical tables exist
	tables := []string{"users", "plants", "game_stats", "plant_ownerships"}
	for _, table := range tables {
		if !models.Database.Migrator().HasTable(table) {
			// If table doesn't exist, there's an issue with migration
			return fmt.Errorf("table %s does not exist after migration", table)
		}
	}

	return nil
}

func TeardownTestDatabase() error {
	var tableNames []string

	// Query to get all table names in the current database (PostgreSQL syntax)
	models.Database.Raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'").Scan(&tableNames)

	// Instead of dropping tables, truncate them to maintain schema
	// Use a transaction to ensure all truncates are performed or none
	tx := models.Database.Begin()

	// Disable foreign key checks while truncating
	tx.Exec("SET session_replication_role = 'replica';")

	// Truncate all tables
	for _, tableName := range tableNames {
		// Skip migration tables
		if tableName == "schema_migrations" {
			continue
		}
		if err := tx.Exec("TRUNCATE TABLE " + tableName + " CASCADE").Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	// Re-enable foreign key checks
	tx.Exec("SET session_replication_role = 'origin';")

	return tx.Commit().Error
}
