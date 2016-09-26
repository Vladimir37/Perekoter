package controllers

import (
	"strconv"

	"Perekoter/models"

	"github.com/gin-gonic/gin"
)

func AddThread(c *gin.Context) {
	numbering, _ := strconv.ParseBool(c.PostForm("numbering"))
	roman, _ := strconv.ParseBool(c.PostForm("roman"))
	currentNum, _ := strconv.Atoi(c.PostForm("current_num"))
	title := c.PostForm("title")
	headerLink, _ := strconv.ParseBool(c.PostForm("header_link"))
	header := c.PostForm("header")
	boardNum, _ := strconv.Atoi(c.PostForm("board"))

	db := models.DB()
	defer db.Close()

	var targetBoard models.Board
	db.First(&targetBoard, boardNum)
}
