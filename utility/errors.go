package utility

import (
	"Perekoter/models"
)

func NewError(text string) {
	db := models.DB()
	defer db.Close()

	db.Create(&models.Error{
		Text:   text,
		Active: true,
	})
}

func ConfirmError(num int) {
	db := models.DB()
	defer db.Close()

	var targetError models.Error
	db.First(&targetError, num)
	targetError.Active = false
	db.Save(&targetError)
}

func CoonfirmAllErrors() {
	db := models.DB()
	defer db.Close()

	var allErrors []models.Error
	db.Find(allErrors)

	db.Model(&allErrors).Update("Active", true)
}

func GetAllErrors(active bool) []models.Error {
	db := models.DB()
	defer db.Close()

	var activeErrors []models.Error
	db.Find(&activeErrors, models.Error{
		Active: active,
	})

	return activeErrors
}

func GetActiveErrorsCount() int {
	db := models.DB()
	defer db.Close()

	var count int
	db.Find(models.Error{
		Active: true,
	}).Count(&count)

	return count
}
