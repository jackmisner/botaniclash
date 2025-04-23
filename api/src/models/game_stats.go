package models

import("gorm.io/gorm")
type GameStats struct {
	UserID      uint   `json:"user_id"`
	Username    string `json:"username"`
	GamesPlayed int    `json:"games_played"`
	GamesWon    int    `json:"games_won"`
}

// Updates the game statistics for a user based on the result of a game
func UpdateGameStatsBasedOnResult(userID uint, isWin bool) error {
	// Declare a variable to hold the user's game statistics
	var stats GameStats

	// Retrieve the game statistics for the user from the database
	if err := Database.Where("user_id = ?", userID).First(&stats).Error; err != nil {
		// Return an error if the user's statistics cannot be found
		return err
	}

	// Prepare a map of updates to apply to the game statistics
	updates := map[string]interface{}{
		"games_played": gorm.Expr("games_played + 1"), // Increment the games played count
	}
	if isWin {
		// If the user won, increment the games won count
		updates["games_won"] = gorm.Expr("games_won + 1")
	}

	// Apply the updates to the user's game statistics in the database
	return Database.Model(&stats).Updates(updates).Error
}

// Retrieves all game statistics, including usernames, from the database
func GetAllGameStats() ([]GameStats, error) {
	// Declare a slice to hold the results
	var results []GameStats

	// Query the database to join game statistics with user information
	err := Database.Table("game_stats").
		Select("game_stats.user_id, users.username, game_stats.games_played, game_stats.games_won"). // Select relevant fields
		Joins("JOIN users ON users.id = game_stats.user_id"). // Join with the users table to get usernames
		Scan(&results).Error // Scan the results into the slice

	// Return the results and any error encountered
	return results, err
}

// Creates a new game statistics record for a new user
func CreateGameStatsForNewUser(userID uint) error {
	// Create a new GameStats instance with the provided user ID
	stats := &GameStats{UserID: userID}

	// Insert the new game statistics record into the database
	return Database.Create(stats).Error
}