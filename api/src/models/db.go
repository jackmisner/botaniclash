package models

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Database *gorm.DB

func OpenDatabaseConnection() {
	connection_string := os.Getenv("POSTGRES_URL")
	fmt.Println(connection_string)

	var err error
	Database, err = gorm.Open(postgres.Open(connection_string), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected to database")
}

func AutoMigrateModels() {
	// Auto-migrate all models
	Database.AutoMigrate(&User{})
	Database.AutoMigrate(&Plant{})
	Database.AutoMigrate(&PlantOwnership{})
	Database.AutoMigrate(&GameStats{})

	// If the username column exists in the GameStats table but not in the struct, drop it
	if Database.Migrator().HasTable(&GameStats{}) && Database.Migrator().HasColumn(&GameStats{}, "username") {
		fmt.Println("Dropping 'username' column from game_stats table")
		Database.Exec("ALTER TABLE game_stats DROP COLUMN IF EXISTS username")
	}
}
