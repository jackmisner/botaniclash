package seeds

import (
	"fmt"

	"github.com/jackmisner/botaniclash/src/models"
	"github.com/jackmisner/botaniclash/src/passwordhashing"
	"gorm.io/gorm"
)

// UserSeeds seeds the users table with 10 sample users
func UserSeeds(db *gorm.DB) {
	fmt.Println("Seeding users...")

	// sample users with plain text passwords
	users := []models.User{
		{Username: "luke", Password: "password123"},
		{Username: "imogen", Password: "password123"},
		{Username: "abbie", Password: "password123"},
		{Username: "alec", Password: "password123"},
		{Username: "jack", Password: "password123"},
		{Username: "michal", Password: "password123"},
		{Username: "will", Password: "password123"},
		{Username: "john", Password: "password123"},
		{Username: "dan", Password: "password123"},
		{Username: "testuser", Password: "password123"},
	}

	// Insert the users into the database with hashed passwords
	for i, user := range users {
		// Hash the password before saving
		user.Password = passwordhashing.HashPassword(user.Password)

		result := db.Create(&user)
		if result.Error != nil {
			fmt.Printf("Error creating user %s: %v\n", user.Username, result.Error)
		} else {
			fmt.Printf("Created user %d/10: %s\n", i+1, user.Username)
		}
	}

	fmt.Println("User seeding completed! Created 10 users.")
}
