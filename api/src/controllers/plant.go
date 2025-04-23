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

// --------------- Fetch all plants from DB, shuffle them and return twenty random cards ----------------//

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
	StatToCompare *string `json:"stat_to_compare"`
}

// --------------- Compare player and opponent plants based on stat to compare and return the winner ----------------//

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
	
	if statToCompare == nil {
		computerChoice := computerChooseCompetitiveStat(opponentPlant)
		statToCompare = &computerChoice
	}

	// Step 4: Calculate who wins (or draws) using the helper function
	winner := DeterminePlantWinner(playerPlant, opponentPlant, *statToCompare)

	if winner == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":       fmt.Sprintf("Invalid stat to compare: %s", *statToCompare),
			"valid_stats": []string{"year", "light", "soil_nutriments", "atmospheric_humidity", "edible", "ph_range"},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"winner": winner, "stat": statToCompare})
}

// --------------- Compares two plants based on statToCompare and returns a string saying who has won ----------------//

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

// --------------- Choose a competitive stat to play if it is the computer's turn ----------------//

func computerChooseCompetitiveStat(opponentPlant *models.Plant) string {
	// Step 0: Create new rand to be used throughout function
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	// Step 1: Determine if plant is edible, if the plant is edible there is a random chance this will be the return value
	if r.Intn(10) % 2 == 0 && opponentPlant.Edible  {
			return "edible"	
	}

	// Step 2: Compare light, soil nutriments and atmospheric humidity to determine which has the lowest score 
	fieldName, score := findLowestScore(opponentPlant)
	
	// Step 3: Calculate ph range, compare ph range to the result of findLowestScore to see which is the most competitive
	phRange := opponentPlant.CalculatePhRange()

	if phRange > 25 && score >= 5 {
		return "ph_range"
	} else if fieldName != "null" && score <= 5 {
		return fieldName
	}

	// Step 4: Check if the value of year is competitive
	if opponentPlant.Year <= 1753 {
		return "year"
	}

	// Step 5: If all the comparisons fail a stat is returned at random
	var randomValue string
	possiblevalues := [6]string{"year", "edible", "light", "nutriments_required", "humidity_level", "ph_range"}
	rand.Shuffle((3), func(i, j int) {
		possiblevalues[i], possiblevalues[j] = possiblevalues[j], possiblevalues[i]
	})

	randomValue = possiblevalues[0]

	return randomValue
}


// --------------- Find the value with the lowest score, returns the name and score of lowest value ----------------//

func findLowestScore(opponent_card *models.Plant) (string, int) {
	// Step 1: Define the name of the variables we want to return
	var lowestFieldName string 
	var fieldValue int

	// Step 2: Create a map containing the three values we want to check
	checkValues := make(map[string]int)

	checkValues["light"] = opponent_card.Light
	checkValues["soil_nutriments"] = opponent_card.SoilNutriments
	checkValues["atmospheric_humidity"] = opponent_card.AtmosphericHumidity
	
	// Step 3: Loop through the map to find value with lowest score
	for key, val := range checkValues {
		if lowestFieldName == "" {
			lowestFieldName = key
			fieldValue = val
		} else if val < checkValues[lowestFieldName]{
			lowestFieldName = key
			fieldValue = val
		}
	}  
	
	return lowestFieldName, fieldValue
}

// -- Converts snake case strings taken from JSON data into a format that can be used to index struct values using the reflect package ----------------//

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
