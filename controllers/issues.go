package controllers

import (
	"Perekoter/models"
	"Perekoter/utility"

	"github.com/gin-gonic/gin"
)

func GetAllIssues(c *gin.Context) {
	var request utility.NumRequest
	c.Bind(&request)

	active := true
	var issues []models.Issue

	db := models.DB()
	defer db.Close()

	if request.Num == 1 {
		active = false
	}

	db.Find(&issues, &models.Issue{
		Active: active,
	})

	c.JSON(200, gin.H{
		"status": 0,
		"body":   issues,
	})

}

func GetIssue(c *gin.Context) {
	var request utility.NumRequest
	c.Bind(&request)
}

func SendIssue(c *gin.Context) {
	var request utility.IssueRequest
	c.Bind(&request)

	db := models.DB()
	defer db.Close()

	db.Create(&models.Issue{
		Title:  request.Title,
		Text:   request.Text,
		Link:   request.Link,
		Active: true,
	})

	c.JSON(200, gin.H{
		"status": 0,
	})
}

func CloseIssue(c *gin.Context) {
	var request utility.NumRequest
	c.Bind(&request)

	db := models.DB()
	defer db.Close()

	var issue models.Issue
	db.First(&issue, request.Num)

	issue.Active = false
	db.Save(&issue)

	c.JSON(200, gin.H{
		"status": 0,
	})
}
