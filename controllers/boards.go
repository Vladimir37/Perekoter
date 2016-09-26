package controllers

import (
	"strconv"

	"Perekoter/models"

	"github.com/gin-gonic/gin"
)

func AddBoard(c *gin.Context) {
	name := c.PostForm("name")
	addr := c.PostForm("addr")
	bumplimit, err := strconv.Atoi(c.PostForm("bumplimit"))

	if err != nil {
		c.JSON(200, gin.H{
			"status": 1,
		})
	}

	db := models.DB()
	defer db.Close()

	db.Create(&models.Board{
		Addr:      addr,
		Name:      name,
		Bumplimit: bumplimit,
	})

	c.JSON(200, gin.H{
		"status": 0,
	})
}

func EditBoard(c *gin.Context) {
	id, errId := strconv.Atoi(c.PostForm("id"))
	name := c.PostForm("name")
	addr := c.PostForm("addr")
	bumplimit, errBl := strconv.Atoi(c.PostForm("bumplimit"))

	if (errId != nil) || (errBl != nil) {
		c.JSON(200, gin.H{
			"status": 1,
		})
	}

	db := models.DB()
	defer db.Close()

	var board models.Board
	db.First(&board, id)

	board.Addr = addr
	board.Name = name
	board.Bumplimit = bumplimit

	db.Save(&board)

	c.JSON(200, gin.H{
		"status": 0,
	})
}

func DeleteBoard(c *gin.Context) {
	id, err := strconv.Atoi(c.PostForm("id"))
	if err != nil {
		c.JSON(200, gin.H{
			"status": 1,
		})
	}

	db := models.DB()
	defer db.Close()

	var board models.Board
	db.First(&board, id)

	db.Delete(&board)

	c.JSON(200, gin.H{
		"status": 0,
	})
}
