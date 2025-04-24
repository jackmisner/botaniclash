package models_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/jackmisner/botaniclash/src/models"
	"github.com/jackmisner/botaniclash/src/passwordhashing"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestMain(m *testing.M) {
	// 1) Setup the test database
	err := SetupTestDatabase()
	if err != nil {
		fmt.Println("Error setting up test database:", err)
		os.Exit(1)
	}

	// 2) Run the tests
	code := m.Run()

	// 3) Cleanup the test database
	err = TeardownTestDatabase()
	if err != nil {
		fmt.Println("Error tearing down test database:", err)
		os.Exit(1)
	}

	// 4) Exit the tests
	os.Exit(code)
}

// TestFindUserByUsername creates and saves a user, then checks if the user can be retrieved by Username
func TestFindUserByUsername(t *testing.T) {
	// 1) Create a test user
	testUser := &models.User{
		Username: "GardenLover",
		Password: passwordhashing.HashPassword("123Plant"),
	}

	// 2) Save the test user
	savedUser, err := testUser.Save()
	require.NoError(t, err)

	// 3) Retrieve the user by username
	fetchedUser, err := models.FindUserByUsername(savedUser.Username)
	require.NoError(t, err)

	// 4) Compare the user we created to the data we retrieved
	assert.Equal(t, savedUser.Username, fetchedUser.Username)
	// Don't compare passwords directly as they're now hashed
	assert.NotEmpty(t, fetchedUser.Password, "Password should not be empty")
	// Verify that we can authenticate with the correct password
	assert.True(t, passwordhashing.VerifyPassword(fetchedUser.Password, "123Plant"), "Should be able to verify with correct password")
}
