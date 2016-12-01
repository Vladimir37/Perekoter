package controllers

import (
	"Perekoter/models"
	"Perekoter/utility"

	"github.com/gin-gonic/gin"
)

func GetAllErrors (c *gin.Context) {
	var errors []models.Error

	db := models.DB()
	defer db.Close()

	db.Find(&errors)

	c.JSON(200, gin.H{
		"status": 0,
		"body":   errors,
	})
}

func CloseError (c *gin.Context) {
    var request utility.NumRequest
	c.Bind(&request)

	db := models.DB()
	defer db.Close()

	var target_error models.Error
	db.First(&target_error, request.Num)

	target_error.Active = false
	db.Save(&target_error)

	c.JSON(200, gin.H{
		"status": 0,
	})
}

func CloseAllErrors (c *gin.Context) {
	db := models.DB()
	defer db.Close()

	db.Model(&models.Error{}).Update("Active", false)

	c.JSON(200, gin.H{
		"status": 0,
	})
}