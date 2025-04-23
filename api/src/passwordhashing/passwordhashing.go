package passwordhashing

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

// HashPassword encrypts passwords using bcrypt
// It prints an error to the terminal if the encryption fails
func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		fmt.Println("HASH FAILED! ", err)
	}
	return string(bytes)
}

// VerifyPassword compares the password the user supplies at login to its hash
// Returns true if the hash and password match, false otherwise
func VerifyPassword(hash, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	return true
}
