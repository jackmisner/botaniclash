package models

import "gorm.io/gorm"

type Plant struct {
	gorm.Model
	CommonName          string `json:"common_name"`
	ScientificName      string `json:"scientific_name"`
	ImageUrl            string `json:"image_url"`
	Year                int    `json:"year"`
	Observations        string `json:"observations"`
	Edible              bool   `json:"edible"`
	PhMinimum           int    `json:"ph_minimum"`
	PhMaximum           int    `json:"ph_maximum"`
	Light               int    `json:"light"`
	SoilNutriments      int    `json:"soil_nutriments"`
	AtmosphericHumidity int    `json:"atmospheric_humidity"`
}

func FetchAllPlants() ([]Plant, error) {
	var plants []Plant
	if err := Database.Find(&plants).Error; err != nil {
		return nil, err
	}
	return plants, nil
}

func FetchPlantById(id uint) (*Plant, error) {
	var plant Plant
	err := Database.Find(&plant, id).Error
	if err != nil {
		return &Plant{}, err
	}
	return &plant, nil
}

func (p Plant) CalculatePhRange() uint {
	return uint(p.PhMaximum) - uint(p.PhMinimum)
}
