package seeds

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/jackmisner/botaniclash/src/models"
	"gorm.io/gorm"
)

var ediblePlants = []string{
	"Alfalfa",
	"Amphibious bistort",
	"Ash-leaf maple",
	"Barley",
	"Belgium endive",
	"Bog blueberry",
	"Bog-bean",
	"Bog-myrtle",
	"Bouncing-bet",
	"Carpathian walnut",
	"Cleavers",
	"Common fireweed",
	"Common horsetail",
	"Common plantain",
	"Cowberry",
	"Crampbark",
	"Dutch clover",
	"European bird cherry",
	"European corn mint",
	"European white birch",
	"Hawthorn",
	"Heal-all",
	"Linden",
	"Maize",
	"Northern red oak",
	"Quickbeam",
	"Raspberry",
	"Rum cherry",
	"Scotch pine",
	"Silverweed",
	"Sycamore maple",
	"Water avens",
	"Wheat",
	"Common lilac",
	"Common bird's-foot trefoil",
	"Cowgrass clover",
	"Common vetch",
	"Greater bird's-foot trefoil",
	"Cow vetch",
	"Alsike clover",
	"Strawberry clover",
	"Pear",
	"Wild plum",
	"Pomegranate",
	"Sunflower",
	"Meadowsweet",
	"India mustard",
	"Annual yellow lupin",
	"Mediterranean white lupin",
	"Arrowleaf clover",
	"Snail medic",
	"Tickseed-sunflower",
}

// PlantData represents the structure of data from the first API endpoint
// (the one we used to mainly grab the ID to pass to the second API endpoint)
type PlantData struct {
	Data []struct {
		ID             int    `json:"id"`
		CommonName     string `json:"common_name"`
		ScientificName string `json:"scientific_name"`
		ImageURL       string `json:"image_url"`
		Year           int    `json:"year"`
	} `json:"data"`
}

// PlantDetails represents the structure of data from the second API endpoint
// (the one we used to grab the detailed information about the plant)
type PlantDetails struct {
	Data struct {
		ID             int    `json:"id"`
		CommonName     string `json:"common_name"`
		ScientificName string `json:"scientific_name"`
		ImageURL       string `json:"image_url"`
		Year           int    `json:"year"`
		Observations   string `json:"observations"`
		Edible         bool   `json:"edible"`

		// These properties are nested in the "growth" object
		Growth struct {
			PhMinimum           float64 `json:"ph_minimum"`
			PhMaximum           float64 `json:"ph_maximum"`
			Light               int     `json:"light"`
			SoilNutriments      int     `json:"soil_nutriments"`
			AtmosphericHumidity int     `json:"atmospheric_humidity"`
		} `json:"growth"`
	} `json:"data"`
}

// PlantSeeds seeds the plant table with data from the trefle.io API (2 endpoints are used)
func PlantSeeds(db *gorm.DB) {
	fmt.Println("Seeding plants...")

	// Get API tokens from environment variables
	var tokens []string
	for i := 1; i <= 3; i++ {
		tokenKey := fmt.Sprintf("TREFLE_API_TOKEN%d", i)
		token := os.Getenv(tokenKey)
		if token != "" {
			tokens = append(tokens, token)
		}
	}

	if len(tokens) == 0 {
		// Try fallback to the original token name for backward compatibility
		if token := os.Getenv("TREFLE_API_TOKEN"); token != "" {
			tokens = append(tokens, token)
		} else {
			fmt.Println("Error: No Trefle API tokens found in environment variables")
			return
		}
	}

	fmt.Printf("Found %d API tokens to use\n", len(tokens))

	// Count of plants created so far
	plantCount := 0
	// Max number of plants to create
	maxPlants := 283
	// Current token index for rotation
	tokenIndex := 0

	// Get next token in rotation
	getNextToken := func() string {
		token := tokens[tokenIndex]
		tokenIndex = (tokenIndex + 1) % len(tokens)
		return token
	}

	// Iterate through pages 1-18 (although we should hit 283 plants before this)
	for page := 1; page <= 18; page++ {
		// Break the loop if we've already created enough plants
		if plantCount >= maxPlants {
			break
		}

		// ================ Step 1: Get list of plants from API endpoint for current page ================
		token := getNextToken()
		plantsURL := fmt.Sprintf("https://trefle.io/api/v1/species?token=%s&filter_not[nitrogen_fixation]=null&filter_not[edible]=null&filter_not[year]=null&filter_not[light]=null&filter_not[growth_rate]=null&page=%d", token, page)
		fmt.Printf("Fetching plants from page %d using token %d...\n", page, tokenIndex+1)

		response, err := http.Get(plantsURL)
		if err != nil {
			fmt.Printf("Error fetching plants list from page %d: %v\n", page, err)
			continue // Try the next page if this one fails
		}
		defer response.Body.Close() // defer the closure of the response body

		// ======================== Step 2: Read the response body ============================
		body, err := io.ReadAll(response.Body)
		if err != nil {
			fmt.Printf("Error reading response body from page %d: %v\n", page, err)
			continue // Try the next page if this one fails
		}

		// ====================== Step 3: Unmarshal the response body =========================
		var plantData PlantData
		err = json.Unmarshal(body, &plantData)
		if err != nil {
			fmt.Printf("Error unmarshalling plants data from page %d: %v\n", page, err)
			continue // Try the next page if this one fails
		}

		// ============== Step 4: For each plant on this page, get all the detailed info ===================
		for _, plant := range plantData.Data {
			// Check if we've reached the max number of plants
			if plantCount >= maxPlants {
				break
			}

			// Get detailed plant information using the next token in rotation
			token := getNextToken()
			plantDetailsURL := fmt.Sprintf("https://trefle.io/api/v1/species/%d?token=%s", plant.ID, token)

			// get the detailed info
			detailsResponse, err := http.Get(plantDetailsURL)
			if err != nil {
				fmt.Printf("Error fetching details for plant %d: %v\n", plant.ID, err)
				continue
			}

			// read the detailed info
			detailsBody, err := io.ReadAll(detailsResponse.Body)
			detailsResponse.Body.Close()
			if err != nil {
				fmt.Printf("Error reading details for plant %d: %v\n", plant.ID, err)
				continue
			}

			// unmarshal the detailed info
			var plantDetails PlantDetails
			err = json.Unmarshal(detailsBody, &plantDetails)
			if err != nil {
				fmt.Printf("Error unmarshalling details for plant %d: %v\n", plant.ID, err)
				continue
			}

			// ============== Step 5: Create the plant record in the database ===================
			newPlant := models.Plant{
				CommonName:          plantDetails.Data.CommonName,
				ScientificName:      plantDetails.Data.ScientificName,
				ImageUrl:            plantDetails.Data.ImageURL,
				Year:                plantDetails.Data.Year,
				Observations:        plantDetails.Data.Observations,
				Edible:              plantDetails.Data.Edible,
				PhMinimum:           int(plantDetails.Data.Growth.PhMinimum * 10), // Convert float to int
				PhMaximum:           int(plantDetails.Data.Growth.PhMaximum * 10), // Convert float to int
				Light:               plantDetails.Data.Growth.Light,
				SoilNutriments:      plantDetails.Data.Growth.SoilNutriments,
				AtmosphericHumidity: plantDetails.Data.Growth.AtmosphericHumidity,
			}

			if newPlant.CommonName == "" {
				fmt.Printf("Skipping plant with no common name (ID: %d)\n", plant.ID)
				continue
			}

			for _, ediblePlant := range ediblePlants {
				if newPlant.CommonName == ediblePlant {
					newPlant.Edible = true
					continue
				}
			}

			result := db.Create(&newPlant)
			if result.Error != nil {
				fmt.Printf("Error creating plant record for %s: %v\n", newPlant.CommonName, result.Error)
			} else {
				plantCount++
				fmt.Printf("Created plant %d/%d: %s (using token %d)\n", plantCount, maxPlants, newPlant.CommonName, tokenIndex+1)
			}
		}
	}

	fmt.Printf("Plant seeding completed! Created %d plants.\n", plantCount)
}
