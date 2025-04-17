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
	ID                  uint     `json:"id"`
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
	}) // Shuffle the plants slice in place using the random number generator.

	var randomCards []PlantData
	for i := 0; i < 20 && i < len(plants); i++ { // Selects the first 20 plants from the shuffled slice
		p := plants[i]                                      // Creating a new plant object for each plant in the slice
		phRange := p.PhMaximum - p.PhMinimum                // Calculating the pH range by subtracting the minimum pH from the maximum pH
		phAverage := float64(p.PhMinimum+p.PhMaximum) / 2.0 // Calculating the average pH by adding the minimum and maximum pH values and dividing by 2.0

		randomCards = append(randomCards, PlantData{ // Creates a new plant object and adds it to the randomcard slice
			ID:             p.ID,
			CommonName:     p.CommonName,
			ScientificName: p.ScientificName,
			ImageUrl:       p.ImageUrl,
			Year:           p.Year,
			Observations:   p.Observations,
			Edible:         p.Edible,
			PhLevels: PhLevels{
				PhMinimum: p.PhMinimum,
				PhMaximum: p.PhMaximum,
				PhRange:   phRange,
				PhAverage: phAverage,
			},
			Light:               p.Light,
			SoilNutriments:      p.SoilNutriments,
			AtmosphericHumidity: p.AtmosphericHumidity,
		})
	}
	response := PlantCards{ // creates a new plant cards object and adds the random cards slice to it
		Cards: randomCards,
	}
	c.JSON(http.StatusOK, response) // Sends a JSON response with the status code 200 OK alongside the plant data needed
}
