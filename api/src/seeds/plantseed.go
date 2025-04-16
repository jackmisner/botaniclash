package seeds

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/makersacademy/go-react-acebook-template/api/src/models"
	"gorm.io/gorm"
)

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

// PlantSeeds seeds the plant table with data from the trefle.io API
func PlantSeeds(db *gorm.DB) {
	fmt.Println("Seeding plants...")

	// My api token (really should probs put this in the .env file)
	token := "lwFH_fvRo3ucJFsRvq9pUBkoZgoUxRjyl3NuWs7GEBk"

	// ================ Step 1: Get list of plants from first API endpoint ================
	plantsURL := fmt.Sprintf("https://trefle.io/api/v1/species?token=%s&filter_not[nitrogen_fixation]=null&filter_not[edible]=null&filter_not[year]=null&filter_not[light]=null&filter_not[growth_rate]=null&page=4", token)
	response, err := http.Get(plantsURL)
	if err != nil {
		fmt.Println("Error fetching plants list:", err)
		return
	}
	defer response.Body.Close() // defer the closure ofthe response body

	// ======================== Step 2: Read the response body ============================
	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return
	}

	// ====================== Step 3: Unmarshal the response body =========================
	var plantData PlantData
	err = json.Unmarshal(body, &plantData)
	if err != nil {
		fmt.Println("Error unmarshalling plants data:", err)
		return
	}

	// ============== Step 4: For each plant, get all the detailed info ===================
	for i, plant := range plantData.Data {
		if i >= 30 { // Limit to 30 plants (each page only returns 20 anyway, not sure how to get more 🤔)
			break
		}

		// Get detailed plant information
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

		// ============== Step 4: For each plant, get all the detailed info ===================
		newPlant := models.Plant{
			CommonName:          plantDetails.Data.CommonName,
			ScientificName:      plantDetails.Data.ScientificName,
			ImageUrl:            plantDetails.Data.ImageURL,
			Year:                plantDetails.Data.Year,
			Observations:        plantDetails.Data.Observations,
			Edible:              plantDetails.Data.Edible,
			PhMinimum:           int(plantDetails.Data.Growth.PhMinimum * 10), // Convert float to int (store as tenths)
			PhMaxiumum:          int(plantDetails.Data.Growth.PhMaximum * 10), // Convert float to int (store as tenths)
			Light:               plantDetails.Data.Growth.Light,
			SoilNutriments:      plantDetails.Data.Growth.SoilNutriments,
			AtmosphericHumidity: plantDetails.Data.Growth.AtmosphericHumidity,
		}

		result := db.Create(&newPlant)
		if result.Error != nil {
			fmt.Printf("Error creating plant record for %s: %v\n", newPlant.CommonName, result.Error)
		} else {
			fmt.Printf("Created plant: %s\n", newPlant.CommonName)
		}
	}

	fmt.Println("Plant seeding completed!")
}
