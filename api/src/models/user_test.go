package models

import (
	"testing"

	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func OpenConnection()  {
	err := godotenv.Load("../../.test.env")
	if err != nil {
		panic("Error loading .test.env file")
	}
	OpenDatabaseConnection()
	AutoMigrateModels()
}

func TestFindUserbyUsername(t *testing.T)  {
	OpenConnection()
	testuser := &User{
		Username: "GardenLover", 
		Password: "123Plant"}
	
	savedUser, err := testuser.Save()
	require.NoError(t, err)

	fetchedUser, err := FindUserByUsername(savedUser.Username)
	require.NoError(t, err)

	assert.Equal(t, savedUser.Username, fetchedUser.Username)
	assert.Equal(t, savedUser.Password, fetchedUser.Password) // This may need to be rewritten if password hashing is introduced

}