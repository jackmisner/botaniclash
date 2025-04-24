package seeds

import (
	"fmt"

	"github.com/jackmisner/botaniclash/src/models"
	"gorm.io/gorm"
)

// GameStatsSeeds seeds the game_stats table with initial stats for each user
func GameStatsSeeds(db *gorm.DB) {
	fmt.Println("Seeding game stats...")

	// Get all users to create game stats for them
	var users []models.User
	result := db.Find(&users)
	if result.Error != nil {
		fmt.Printf("Error fetching users: %v\n", result.Error)
		return
	}

	for i, user := range users {
		// Create game stats with initial values for each user
		gameStats := models.GameStats{
			UserID:      user.ID,
			GamesPlayed: 0,
			GamesWon:    0,
		}

		result := db.Create(&gameStats)
		if result.Error != nil {
			fmt.Printf("Error creating game stats for user %s: %v\n", user.Username, result.Error)
		} else {
			fmt.Printf("Created game stats %d/%d for user: %s\n", i+1, len(users), user.Username)
		}
	}

	fmt.Printf("Game stats seeding completed! Created stats for %d users.\n", len(users))
}
