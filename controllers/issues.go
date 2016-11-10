package controllers

import (
	// "Perekoter/models"
	"Perekoter/utility"

	"github.com/gin-gonic/gin"
)

func GetAllIssues(c *gin.Context) {
	//
}

func GetIssue(c *gin.Context) {
	var request utility.NumRequest
	c.Bind(&request)
}

func SendIssue(c *gin.Context) {
	//
}

func CloseIssue(c *gin.Context) {
	var request utility.IssueRequest
	c.Bind(&request)
}
