package models

import "gorm.io/gorm"

type Plant struct {
	gorm.Model
	CommonName string `"json":"`
}