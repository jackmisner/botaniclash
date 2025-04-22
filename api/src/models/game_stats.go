package models

import (
	"gorm.io/gorm"
)

type GameStats struct {
	gorm.Model
	UserID	   uint   `gorm:"not null"`
	User       User   `gorm:"foreignKey:UserID"`
	GamesPlayed   int    `gorm:"default:0"`
	GamesWon	  int    `gorm:"default:0"`
	GamesLost	  int    `gorm:"default:0"`
	TotalScore	  int    `gorm:"default:0"`
}

