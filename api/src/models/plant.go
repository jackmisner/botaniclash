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
	PhMinium            int    `json:"ph_minimum"`
	PhMaxiumum          int    `json:"ph_maximum"`
	Light               int    `json:"light"`
	SoilNutriments      int    `json:"soil_nutriments"`
	AtmosphericHumidity int    `json:"atmospheric_humidity"`
}
