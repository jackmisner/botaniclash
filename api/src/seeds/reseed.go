package seeds

import (
	"fmt"

	"github.com/makersacademy/go-react-acebook-template/api/src/models"
	"gorm.io/gorm"
)

// Reseed drops all tables and reseeds the database
func Reseed(db *gorm.DB) {
	fmt.Println("Reseeding database...")

	// Drop tables if they exist
	DropTablesIfExist(db)

	// Migrate tables
	MigrateTables(db)

	// Seed tables
	SeedDatabase(db)

	fmt.Println("Database reseeded successfully!")
}

// MigrateTables creates all necessary tables
func MigrateTables(db *gorm.DB) {
	fmt.Println("Migrating tables...")

	// Create tables for all models
	db.AutoMigrate(&models.Plant{})
	db.AutoMigrate(&models.User{})
	// We can do plant_ownership later
}
