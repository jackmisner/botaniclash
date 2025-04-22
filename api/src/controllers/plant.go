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
	
	// Step 3: Checking if it is the user or computer's turn 
	if statToCompare == "null" {
		statToCompare = computerChooseCompetitiveStat(opponentPlant)
	}

	

	// Step 4: Calculate who wins (or draws) using the helper function
	winner := DeterminePlantWinner(playerPlant, opponentPlant, statToCompare)

	if winner == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":       fmt.Sprintf("Invalid stat to compare: %s", statToCompare),
			"valid_stats": []string{"year", "light", "soil_nutriments", "atmospheric_humidity", "edible", "ph_range"},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"winner": winner, "stat": statToCompare})
}

func DeterminePlantWinner(playerPlant, opponentPlant *models.Plant, statToCompare string) string {
	if statToCompare == "edible" {
		if playerPlant.Edible && !opponentPlant.Edible {
			return "player"
		} else if !playerPlant.Edible && opponentPlant.Edible {
			return "opponent"
		} else {
			return "draw"
		}
	} else if statToCompare == "ph_range" {
		playerPhRange := playerPlant.CalculatePhRange()
		opponentPhRange := opponentPlant.CalculatePhRange()

		if playerPhRange > opponentPhRange {
			return "player"
		} else if opponentPhRange > playerPhRange {
			return "opponent"
		} else {
			return "draw"
		}
	} else {
		// Convert snake_case (json) to PascalCase (needed for struct field access)
		fieldName := convertSnakeToPascal(statToCompare)

		playerValue := reflect.ValueOf(*playerPlant).FieldByName(fieldName)
		opponentValue := reflect.ValueOf(*opponentPlant).FieldByName(fieldName)

		if playerValue.Int() < opponentValue.Int() {
			return "player"
		} else if opponentValue.Int() < playerValue.Int() {
			return "opponent"
		} else {
			return "draw"
		}
	}
}

func computerChooseCompetitiveStat(opponentPlant *models.Plant) string {
	// Step 0:  We're going to be using random choice twice in this function so we set it up here
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	// Step 1: Determine if plant is edible, if the plant is edible there is a random chance this will be the return value
	if opponentPlant.Edible {
		if r.Intn(10) % 2 == 0 {
			return "edible"
		}
	}
	// Step 2: Compare light, soil nutriments and atmospheric humidity to determine which is the lowest and therefore most competitive 
	lowestCompValueName := bestLow(opponentPlant)
	fieldName := convertSnakeToPascal(lowestCompValueName)
	lowestCompValue :=reflect.ValueOf(*opponentPlant).FieldByName(fieldName)

	// Step 3: Determine if the ph range is high enough to be competitive, if not the most competitive value from step 2 takes precedence
	phRange := opponentPlant.CalculatePhRange()

	if phRange > 25 && lowestCompValue.Int() >= 5 {
		return "ph_range"
	} else if lowestCompValueName != "null" {
		return lowestCompValueName
	}
	// Step 4: Check if year is competitive, there is a random chance of it's being returned if so, otherwise return either ph range, light, soil nutriments or atmospheric humidity, depending on what was found the most competitive value 
	if opponentPlant.Year <= 1753 {
		return "year"
	}

	// Step 5: If all the comaprisons fail then we just give up and pick something at random
	var randomValue string
	possiblevalues := [6]string{"year", "edible", "light", "nutriments_required", "humidity_level", "ph_range"}
	rand.Shuffle((3), func(i, j int) {
		possiblevalues[i], possiblevalues[j] = possiblevalues[j], possiblevalues[i]
	})

	randomValue = possiblevalues[0]

	return randomValue
}

func bestLow(opponent_card *models.Plant) string {
	var lowest string 
	if opponent_card.Light < opponent_card.SoilNutriments && opponent_card.Light < opponent_card.AtmosphericHumidity {     
		// checks if light is lowest value                  
		lowest = "light"	

	} else if opponent_card.SoilNutriments < opponent_card.Light && opponent_card.SoilNutriments < opponent_card.AtmosphericHumidity{ 
		// checks if soil nutirments is lowest value       
		lowest = "soil_nutriments"

	} else if opponent_card.AtmosphericHumidity < opponent_card.SoilNutriments && opponent_card.AtmosphericHumidity < opponent_card.Light{   
		// checks if atmospheric humidity is lowest value
		lowest = "atmospheric_humidity"

	} else if opponent_card.Light == opponent_card.SoilNutriments && opponent_card.Light == opponent_card.AtmosphericHumidity {
		// Checks if all fields are equal, returns one randomly if they are all equal and lower than four
		fields := [3]string{"light", "soil_nutriments", "atmospheric_humidity"} 
		rand.Shuffle((3), func(i, j int) {
			fields[i], fields[j] = fields[j], fields[i]
		})
		lowest = fields[0]   
	}

	return lowest
}

func convertSnakeToPascal(statToCompare string) string {
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
			return "" // Invalid stat
		}

		return fieldName
}
