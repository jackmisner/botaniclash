package models

import (
	"errors"
	"gorm.io/gorm"
)

type GameStats struct {
	gorm.Model
	UserID      uint   `gorm:"not null"`
	User        User   `gorm:"foreignKey:UserID"`
	GamesPlayed int    `gorm:"default:0"`
	GamesWon    int    `gorm:"default:0"`
	GamesLost   int    `gorm:"default:0"`
	TotalScore  int    `gorm:"default:0"`
}

func CreateGameStats(userID uint) (*GameStats, error) {
	gameStats := &GameStats{UserID: userID}
	if err := Database.Create(gameStats).Error; err != nil {
		return nil, err
	}
	return gameStats, nil
}

func GetGameStatsByUserID(userID uint) (*GameStats, error) {
	var gameStats GameStats
	if err := Database.Where("user_id = ?", userID).First(&gameStats).Error; err != nil {
		return nil, err
	}
	return &gameStats, nil
}

func UpdateGameStats(userID uint, gamesPlayed, gamesWon, gamesLost, totalScore int) (*GameStats, error) {
	var gamestats GameStats

	if err := Database.Where("user_id = ?", userID).First(&gamestats).Error; err != nil {
		return nil, err
	}

	updates := map[string]interface{}{
		"games_played": gorm.Expr("games_played + ?", gamesPlayed),
		"games_won":    gorm.Expr("games_won + ?", gamesWon),
		"games_lost":   gorm.Expr("games_lost + ?", gamesLost),
		"total_score":  gorm.Expr("total_score + ?", totalScore),
	}

	if err := Database.Model(&gamestats).Updates(updates).Error; err != nil {
		return nil, err
	}

	return &gamestats, nil
}

func DeleteGameStats(userID uint) error {
	result := Database.Where("user_id = ?", userID).Delete(&GameStats{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no game stats found for the given user ID")
	}
	return nil
}

func GetAllGameStats() ([]GameStats, error) {
	var gameStats []GameStats
	if err := Database.Find(&gameStats).Error; err != nil {
		return nil, err
	}
	return gameStats, nil
}