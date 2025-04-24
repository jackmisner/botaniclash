package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username  string     `json:"username" gorm:"uniqueIndex;not null;size:50;required"`
	Password  string     `json:"password" gorm:"required"`
	GameStats *GameStats `json:"game_stats" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
}

func (user *User) Save() (*User, error) {
	err := Database.Create(user).Error
	if err != nil {
		return &User{}, err
	}

	return user, nil
}

func FindUser(id string) (*User, error) {
	var user User
	err := Database.Where("id = ?", id).First(&user).Error

	if err != nil {
		return &User{}, err
	}

	return &user, nil
}

func FindUserByUsername(username string) (*User, error) {
	var user User
	err := Database.Where("username = ?", username).First(&user).Error

	if err != nil {
		return &User{}, err
	}

	return &user, nil
}
