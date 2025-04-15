package models

type PlantOwnership struct {
	ID      uint `json:"id" gorm:"primaryKey"`
	UserID  uint `json:"user_id" gorm:"not null"`
	PlantID uint `json:"plant_id" gorm:"not null"`
}
