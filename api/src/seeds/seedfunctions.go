package seeds

import (
	"fmt"

	"gorm.io/gorm"
)

// SeedDatabase calls all seed functions
func SeedDatabase(db *gorm.DB) {
	fmt.Println("Seeding database...")

	// Call all seed functions here (we only have one for now, but can add users, and plant_ownership later)
	PlantSeeds(db)
}

// DropTablesIfExist drops all tables before reseeding
func DropTablesIfExist(db *gorm.DB) {
	fmt.Println("Dropping existing tables...")

	// Drop plant_ownerships table
	db.Exec("DROP TABLE IF EXISTS plant_ownerships")

	// Drop plants table
	db.Exec("DROP TABLE IF EXISTS plants")

	// Drop users table
	db.Exec("DROP TABLE IF EXISTS users CASCADE")

	// Drop posts table (to be removed later)
	db.Exec("DROP TABLE IF EXISTS posts CASCADE")
}
