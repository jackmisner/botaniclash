package controllers_test

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/makersacademy/go-react-acebook-template/api/src/auth"
	"github.com/makersacademy/go-react-acebook-template/api/src/controllers"
	"github.com/makersacademy/go-react-acebook-template/api/src/middleware"
	"github.com/makersacademy/go-react-acebook-template/api/src/models"
	models_test "github.com/makersacademy/go-react-acebook-template/api/src/tests/models"
	"github.com/stretchr/testify/assert"
)

func TestMain(m *testing.M) {
	// 1) Setup the test database
	err := models_test.SetupTestDatabase()
	if err != nil {
		fmt.Println("Error setting up test database:", err)
		os.Exit(1)
	}

	// 2) Run the tests
	code := m.Run()

	// 3) Cleanup the test database
	err = models_test.TeardownTestDatabase()
	if err != nil {
		fmt.Println("Error tearing down test database:", err)
		os.Exit(1)
	}

	// 4) Exit the tests
	os.Exit(code)
}

// Use the below test as a template for writing more tests (follow the same pattern)
func TestGetAllPlants(t *testing.T) {
	// ========= Part 1 - Set-up =========
	// 1) Create a test Gin router
	router := gin.Default()

	// 2) Setup route with authentication middleware
	router.GET("/plants", middleware.AuthenticationMiddleware, controllers.GetAllPlants)

	// 3) Create a test user ID and generate JWT token
	testUserID := "1"
	token, err := auth.GenerateToken(testUserID)
	assert.NoError(t, err, "Failed to generate token")

	// 4) Create a new HTTP request & add the JWT token to the Authorization header
	req, _ := http.NewRequest("GET", "/plants", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	// 5) Create a new HTTP recorder
	w := httptest.NewRecorder()

	// 6) Seed the database with some test plant data
	plant1 := models.Plant{
		CommonName:          "Alfalfa",
		ScientificName:      "Medicago sativa",
		ImageUrl:            "https://bs.plantnet.org/image/o/example-img1",
		Year:                2023,
		Observations:        "A perennial flowering plant in the legume family",
		Edible:              true,
		PhMinimum:           60,
		PhMaximum:           80,
		Light:               8,
		SoilNutriments:      7,
		AtmosphericHumidity: 5,
	}
	plant2 := models.Plant{
		CommonName:          "Hawthorn",
		ScientificName:      "Crataegus monogyna",
		ImageUrl:            "https://bs.plantnet.org/image/o/example-img2",
		Year:                2022,
		Observations:        "A thorny shrub or small tree with white flowers and red berries",
		Edible:              true,
		PhMinimum:           55,
		PhMaximum:           75,
		Light:               7,
		SoilNutriments:      6,
		AtmosphericHumidity: 4,
	}

	models.Database.Create(&plant1)
	models.Database.Create(&plant2)

	// 7) Serve the request through the router, which will use the middleware
	router.ServeHTTP(w, req)

	// ======= Part 2 - Assertions =======

	// Check the response status code is 200
	assert.Equal(t, http.StatusOK, w.Code, "GET /plants should return a 200 status code")

	// Check that the response body is correct
	var response struct {
		Data struct {
			Cards []models.Plant `json:"cards"`
		} `json:"data"`
		Token string `json:"token"`
	}
	err = json.NewDecoder(w.Body).Decode(&response)
	assert.NoError(t, err)

	// Check that the response body is correct
	assert.LessOrEqual(t, 2, len(response.Data.Cards), "Response should have at least our 2 created plants")

	// Then, verify our plants are included in the response (regardless of order)
	foundAlfalfa := false
	foundHawthorn := false

	for _, plant := range response.Data.Cards {
		if plant.CommonName == "Alfalfa" && plant.ScientificName == "Medicago sativa" {
			foundAlfalfa = true
		}
		if plant.CommonName == "Hawthorn" && plant.ScientificName == "Crataegus monogyna" {
			foundHawthorn = true
		}
	}

	assert.True(t, foundAlfalfa, "Response should include Alfalfa")
	assert.True(t, foundHawthorn, "Response should include Hawthorn")
}
