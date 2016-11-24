package controllers

import (
	"Perekoter/models"

	"github.com/gin-gonic/gin"
)

func GetAllHistory (c *gin.Context) {
    var points []models.HistoryPoint

	db := models.DB()
	defer db.Close()

	db.Find(&points)

	c.JSON(200, gin.H{
		"status": 0,
		"body":   points,
	})
}