package utility

import (
	"Perekoter/models"
)

func NewError(text string) {
	db := models.DB()
	defer db.Close()

	db.Create(&models.Error{
		text:   text,
		active: true,
	})
}
