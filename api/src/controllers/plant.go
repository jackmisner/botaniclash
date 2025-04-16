package controllers

import (
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
)

// PlantCards represents a collection of plant data cards.
type PlantCards struct {
	Cards []PlantData `json:"cards"` // A slice of PlantData objects
}

// PlantData represents detailed information about a plant.
type PlantData struct {
	CommonName          string   `json:"common_name"`
	ScientificName      string   `json:"scientific_name"`
	ImageUrl            string   `json:"image_url"`
	Year                int      `json:"year"`
	Observations        string   `json:"observations"`
	Edible              bool     `json:"edible"`
	PhLevels            PhLevels `json:"ph_levels"`
	Light               int      `json:"light"`
	SoilNutriments      int      `json:"soil_nutriments"`
	AtmosphericHumidity int      `json:"atmospheric_humidity"`
}

// PhLevels represents the pH level requirements of a plant.
type PhLevels struct {
	PhMinimum int     `json:"ph_minimum"`
	PhMaximum int     `json:"ph_maximum"`
	PhRange   int     `json:"ph_range"`
	PhAverage float64 `json:"ph_average"`
}

func GetAllPlants(c *gin.Context) {
	// Fetch all plants from the database
	plants, err := models.FetchAllPlants()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch plants"})
		return
	}
	
	r := rand.New(rand.NewSource(time.Now().UnixNano())) // Create a new random number generator seeded with the current time in nanoseconds. 
	r.Shuffle(len(plants), func(i, j int) {
		plants[i], plants[j] = plants[j], plants[i]
	}	) // Shuffle the plants slice in place using the random number generator.

	
