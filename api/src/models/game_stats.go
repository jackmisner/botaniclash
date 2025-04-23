package models

import (
	"gorm.io/gorm"
)

type GameStats struct {
	gorm.Model
	UserID      uint `gorm:"uniqueIndex;not null"`
	GamesPlayed int  `gorm:"default:0"`
	GamesWon    int  `gorm:"default:0"`
}

func GetGameStatsByUserID(userID uint) (*GameStats, error) {
	var gameStats GameStats
	if err := Database.Where("user_id = ?", userID).First(&gameStats).Error; err != nil {
		return nil, nil
	}
	return &gameStats, nil
}

func UpdateGameStats(userID uint, winner string) (*GameStats, error) {
	var gamestats GameStats

	// Retrieve the game stats
	if err := Database.Where("user_id = ?", userID).First(&gamestats).Error; err != nil {
		return nil, err
	}

	// Increment the games played count
	gamestats.GamesPlayed = gamestats.GamesPlayed + 1

	// Increment the games won count if the player is the winner
	if winner == "player" {
		gamestats.GamesWon = gamestats.GamesWon + 1
	}

	// Save the updated game stats back to the database
	if err := Database.Save(&gamestats).Error; err != nil {
		return nil, err
	}
	return &gamestats, nil
}

func GetAllGameStats() ([]GameStats, error) {
	var gameStats []GameStats

	// Retrieve all game stats from the database
	if err := Database.Find(&gameStats).Error; err != nil {
		return nil, err
	}
	return gameStats, nil
}
