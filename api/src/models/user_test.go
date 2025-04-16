package models

import (
	"testing"

	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// This re useable function gets the test database from the .test.env file, 
// uses it to open a DB connection and then autmigrates all tables to get ready for the test
func OpenConnection()  {
	err := godotenv.Load("../../.test.env")
	if err != nil {
		panic("Error loading .test.env file")
	}
	OpenDatabaseConnection()
	AutoMigrateModels()
}

// Creates and saves a user, then checks if the user can be retrieved by Username
func TestFindUserbyUsername(t *testing.T)  {
	OpenConnection()  //Call open connection function
	testuser := &User{  //Setup testuser
		Username: "GardenLover", 
		Password: "123Plant"}
	
	savedUser, err := testuser.Save()  //Save test user 
	require.NoError(t, err)

	fetchedUser, err := FindUserByUsername(savedUser.Username) //Retrieve that user
	require.NoError(t, err)

	assert.Equal(t, savedUser.Username, fetchedUser.Username)  //Compare the user we created to the data we retreieved
	assert.Equal(t, savedUser.Password, fetchedUser.Password) // This may need to be rewritten if password hashing is introduced

}