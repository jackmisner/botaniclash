package seeds

import (
	"fmt"

	"gorm.io/gorm"
)

// SeedDatabase calls all seed functions
func SeedDatabase(db *gorm.DB) {
	fmt.Println("Seeding database...")

	// Call all seed functions here
	PlantSeeds(db)
}

// DropTablesIfExist drops all tables before reseeding
func DropTablesIfExist(db *gorm.DB) {
	fmt.Println("Dropping existing tables...")

	// Drop plant_ownerships table
	db.Exec("DROP TABLE IF EXISTS plant_ownerships")

	// Drop plants table
	db.Exec("DROP TABLE IF EXISTS plants")

	// Drop game_stats table
	db.Exec("DROP TABLE IF EXISTS game_stats")

	// Drop users table
	db.Exec("DROP TABLE IF EXISTS users CASCADE")

	// Drop posts table (to be removed later)
	db.Exec("DROP TABLE IF EXISTS posts CASCADE")
}
