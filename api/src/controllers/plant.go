package controllers

import (
	"fmt"
	"math/rand"
	"net/http"
	"reflect"
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
	}) // Shuffle the plants slice in place using the random number generator.

	var randomCards []PlantData
	for i := 0; i < 20 && i < len(plants); i++ { // Selects the first 20 plants from the shuffled slice
		p := plants[i]                                      // Creating a new plant object for each plant in the slice
		phRange := p.PhMaximum - p.PhMinimum                // Calculating the pH range by subtracting the minimum pH from the maximum pH
		phAverage := float64(p.PhMinimum+p.PhMaximum) / 2.0 // Calculating the average pH by adding the minimum and maximum pH values and dividing by 2.0

		randomCards = append(randomCards, PlantData{ // Creates a new plant object and adds it to the randomcard slice
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

type ComparisonSruct struct {
	PlayerCard    uint   `json:"player_card"`
	OpponentCard  uint   `json:"opponent_card"`
	StatToCompare string `json:"stat_to_compare"`
}

func ComparePlants(c *gin.Context) {

	// Step 1: Grabbing plant IDs & stat to compare
	var requestBody ComparisonSruct
	err := c.BindJSON(&requestBody)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "player_card, opponent_card and stat_to_compare are required"})
		return
	}
	statToCompare := requestBody.StatToCompare

	// Step 2: Grabbing those plants from the DB
	playerPlant, _ := models.FetchPlantById(requestBody.PlayerCard)
	opponentPlant, _ := models.FetchPlantById(requestBody.OpponentCard)

	// Step 3: Calculate who wins (or draws)
	if statToCompare == "edible" {
		if playerPlant.Edible && !opponentPlant.Edible {
			c.JSON(http.StatusOK, gin.H{"winner": "player"})
			return
		} else if !playerPlant.Edible && opponentPlant.Edible {
			c.JSON(http.StatusOK, gin.H{"winner": "opponent"})
			return
		} else {
			c.JSON(http.StatusOK, gin.H{"winner": "draw"})
			return
		}
	} else if statToCompare == "ph_range" {
		playerPhRange := playerPlant.CalculatePhRange()
		opponentPhRange := opponentPlant.CalculatePhRange()

		if playerPhRange > opponentPhRange {
			c.JSON(http.StatusOK, gin.H{"winner": "player"})
			return
		} else if opponentPhRange > playerPhRange {
			c.JSON(http.StatusOK, gin.H{"winner": "opponent"})
			return
		} else {
			c.JSON(http.StatusOK, gin.H{"winner": "draw"})
			return
		}
	} else {

		// Convert snake_case (json) to PascalCase (needed for struct field access)
		fieldMap := map[string]string{
			"year":                 "Year",
			"light":                "Light",
			"soil_nutriments":      "SoilNutriments",
			"atmospheric_humidity": "AtmosphericHumidity",
			"ph_minimum":           "PhMinimum",
			"ph_maximum":           "PhMaximum",
		}

		// Get the correct field name
		fieldName, exists := fieldMap[statToCompare]
		if !exists {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":       fmt.Sprintf("Invalid stat to compare: %s", statToCompare),
				"valid_stats": []string{"year", "light", "soil_nutriments", "atmospheric_humidity", "ph_minimum", "ph_maximum", "edible", "ph_range"},
			})
			return
		}

		playerValue := reflect.ValueOf(*playerPlant).FieldByName(fieldName)
		opponentValue := reflect.ValueOf(*opponentPlant).FieldByName(fieldName)

		if playerValue.Int() < opponentValue.Int() {
			c.JSON(http.StatusOK, gin.H{"winner": "player"})
			return
		} else if opponentValue.Int() < playerValue.Int() {
			c.JSON(http.StatusOK, gin.H{"winner": "opponent"})
			return
		} else {
			c.JSON(http.StatusOK, gin.H{"winner": "draw"})
			return
		}
	}
}
