package models_test

import (
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func SetupTestDatabase() error {
	// Setup the postgres database connection string & connect to the database
	connString := "postgres://lukehoweth:postgres@localhost:5432/botaniclash_test?sslmode=disable"
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
