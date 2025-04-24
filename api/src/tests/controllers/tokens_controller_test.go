package controllers_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/jackmisner/botaniclash/src/controllers"
	"github.com/jackmisner/botaniclash/src/models"
	"github.com/jackmisner/botaniclash/src/passwordhashing"
	"github.com/stretchr/testify/assert"
)

func TestCreateToken(t *testing.T) {
	// ========= Part 1 - Set-up =========
	// 1) Create a test Gin router
	router := gin.Default()

	// 2) Setup token route
	router.POST("/tokens", controllers.CreateToken)

	// 3) Create a test user in the database
	testUser := models.User{
		Username: "plantboi117",
		Password: passwordhashing.HashPassword("password123"),
	}
	models.Database.Create(&testUser)

	// 4) Create request body with user credentials
	requestBody := `{
		"Username": "plantboi117",
		"Password": "password123"
	}`

	// 5) Create a new HTTP request
	req, _ := http.NewRequest("POST", "/tokens", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")

	// 6) Create a new HTTP recorder
	w := httptest.NewRecorder()

	// 7) Serve the request through the router
	router.ServeHTTP(w, req)

	// ======= Part 2 - Assertions =======
	// Check the response status code is 201 (Created)
	assert.Equal(t, http.StatusCreated, w.Code, "POST /tokens should return a 201 status code")

	// Parse the response
	var response struct {
		Message string `json:"message"`
		Token   string `json:"token"`
	}
	err := json.NewDecoder(w.Body).Decode(&response)
	assert.NoError(t, err)

	// Check that the response contains the expected fields
	assert.Equal(t, "OK", response.Message, "Response message should be 'OK'")
	assert.NotEmpty(t, response.Token, "Response should include a JWT token")
}

func TestCreateTokenWithInvalidCredentials(t *testing.T) {
	// ========= Part 1 - Set-up =========
	// 1) Create a test Gin router
	router := gin.Default()

	// 2) Setup token route
	router.POST("/tokens", controllers.CreateToken)

	// 3) Create a test user in the database
	testUser := models.User{
		Username: "leafmealone",
		Password: passwordhashing.HashPassword("password123"),
	}
	models.Database.Create(&testUser)

	// 4) Create request body with incorrect password
	requestBody := `{
		"Username": "leafmealone",
		"Password": "wrongpassword"
	}`

	// 5) Create a new HTTP request
	req, _ := http.NewRequest("POST", "/tokens", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")

	// 6) Create a new HTTP recorder
	w := httptest.NewRecorder()

	// 7) Serve the request through the router
	router.ServeHTTP(w, req)

	// ======= Part 2 - Assertions =======
	// Check the response status code is 401 (Unauthorized)
	assert.Equal(t, http.StatusUnauthorized, w.Code, "POST /tokens with invalid credentials should return a 401 status code")

	// Parse the response
	var response struct {
		Message string `json:"message"`
	}
	err := json.NewDecoder(w.Body).Decode(&response)
	assert.NoError(t, err)

	// Check that the response contains the expected message
	assert.Equal(t, "Password incorrect", response.Message, "Response message should indicate password is incorrect")
}
