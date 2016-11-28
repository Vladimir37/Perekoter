package controllers

import (
	"Perekoter/models"
	"Perekoter/utility"

	"github.com/gin-gonic/gin"
)

func GetAllBoards(c *gin.Context) {
	var boards []models.Board

	db := models.DB()
	defer db.Close()

	db.Find(&boards)

	c.JSON(200, gin.H{
		"status": 0,
		"body":   boards,
	})
}

func GetBoard(c *gin.Context) {
	var request utility.NumRequest
	c.Bind(&request)

	db := models.DB()
	defer db.Close()

	var board models.Board
	db.First(&board, request.Num)

	c.JSON(200, gin.H{
		"status": 0,
		"body":   board,
	})
}

func AddBoard(c *gin.Context) {
	var request utility.BoardRequest
	c.Bind(&request)

	db := models.DB()
	defer db.Close()

	db.Create(&models.Board{
		Addr:      request.Address,
		Name:      request.Name,
		Bumplimit: request.Bumplimit,
	})

	go utility.NewHistoryPoint("Board \"" + request.Name + "\" was added")

	c.JSON(200, gin.H{
		"status": 0,
	})
}

func EditBoard(c *gin.Context) {
	var request utility.BoardRequest
	c.Bind(&request)

	db := models.DB()
	defer db.Close()

	var board models.Board
	db.First(&board, request.ID)

	board.Addr = request.Address
	board.Name = request.Name
	board.Bumplimit = request.Bumplimit

	db.Save(&board)

	go utility.NewHistoryPoint("Board \"" + request.Name + "\" was edited")

	c.JSON(200, gin.H{
		"status": 0,
	})
}

func DeleteBoard(c *gin.Context) {
	var request utility.NumRequest
	c.Bind(&request)

	db := models.DB()
	defer db.Close()

	var board models.Board
	db.First(&board, request.Num)

	var threads []models.Thread
	db.Find(&threads, &models.Thread{
		BoardID: board.ID,
	})

	if len(threads) != 0 {
		c.JSON(200, gin.H{
			"status": 1,
		})
		return
	}

	go utility.NewHistoryPoint("Board \"" + board.Name + "\" was deleted")

	db.Delete(&board)

	c.JSON(200, gin.H{
		"status": 0,
	})
}
