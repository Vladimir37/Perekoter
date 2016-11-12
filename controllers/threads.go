package controllers

import (
	"io"
	"os"
	"strconv"
	"time"

	"Perekoter/models"
	"Perekoter/utility"

	"github.com/gin-gonic/gin"
)

func GetAllThreads(c *gin.Context) {
	var threads []models.Thread

	db := models.DB()
	defer db.Close()

	db.Find(&threads)

	c.JSON(200, gin.H{
		"status": 0,
		"body":   threads,
	})
}

func GetThread(c *gin.Context) {
	var request utility.NumRequest
	c.Bind(&request)

	db := models.DB()
	defer db.Close()

	var thread models.Thread
	db.First(&thread, request.Num)

	c.JSON(200, gin.H{
		"status": 0,
		"body":   thread,
	})
}

func AddThread(c *gin.Context) {
	var request utility.ThreadRequest
	c.Bind(&request)

	db := models.DB()
	defer db.Close()

	var targetBoard models.Board
	db.First(&targetBoard, request.BoardNum)

	imageName := strconv.FormatInt(time.Now().Unix(), 10) + ".png"

	img, _, errImg := c.Request.FormFile("cover")
	out, errFile := os.Open("./covers/" + imageName)

	if (errFile != nil) || (errImg != nil) {
		go utility.NewError("Failed to create thread - image not opened")
		go utility.NewHistoryPoint("ERROR: Thread \"" + request.Title + "\" was not created - image not opened")
		c.JSON(200, gin.H{
			"status": 2,
		})
		return
	}

	defer out.Close()

	_, errWriting := io.Copy(out, img)

	if errWriting != nil {
		go utility.NewError("Failed to creating thread - image not created")
		go utility.NewHistoryPoint("ERROR: Thread \"" + request.Title + "\" was not created - image not created")
		c.JSON(200, gin.H{
			"status": 3,
		})
		return
	}

	db.Create(&models.Thread{
		Numbering:     request.Numbering,
		Roman:         request.Roman,
		CurrentNum:    request.CurrentNum,
		CurrentThread: request.CurrentThread,
		Title:         request.Title,
		HeaderLink:    request.HeaderLink,
		Header:        request.Header,
		Image:         imageName,
		Board:         targetBoard,
		BoardID:       targetBoard.ID,
		Active:        true,
	})

	go utility.NewHistoryPoint("Thread \"" + request.Title + "\" was created")

	c.JSON(200, gin.H{
		"status": 0,
	})
}

func EditThread(c *gin.Context) {
	var request utility.ThreadRequest
	c.Bind(&request)

	db := models.DB()
	defer db.Close()

	var targetBoard models.Board
	db.First(&targetBoard, request.BoardNum)

	var thread models.Thread
	db.First(&thread, request.ID)

	thread.Numbering = request.Numbering
	thread.Roman = request.Roman
	thread.CurrentNum = request.CurrentNum
	thread.CurrentThread = request.CurrentThread
	thread.Title = request.Title
	thread.HeaderLink = request.HeaderLink
	thread.Header = request.Header
	thread.Board = targetBoard
	thread.BoardID = targetBoard.ID
	thread.Active = request.Active

	db.Save(&thread)

	go utility.NewHistoryPoint("Thread \"" + request.Title + "\" was created")

	c.JSON(200, gin.H{
		"status": 0,
	})
}

func UploadImage(c *gin.Context) {
	var request utility.NumRequest
	c.Bind(&request)

	db := models.DB()
	defer db.Close()

	var thread models.Thread
	db.First(&thread, request.Num)

	imageName := strconv.FormatInt(time.Now().Unix(), 10) + ".png"

	img, _, errImg := c.Request.FormFile("cover")
	out, errFile := os.Open("./covers/" + imageName)

	if (errFile != nil) || (errImg != nil) {
		go utility.NewError("Failed to upload new thread image - image not opened")
		go utility.NewHistoryPoint("ERROR: Thread image \"" + thread.Title + "\" was not changed - image not opened")
		c.JSON(200, gin.H{
			"status": 2,
		})
		return
	}

	defer out.Close()

	_, errWriting := io.Copy(out, img)

	if errWriting != nil {
		go utility.NewError("Failed to upload new thread image - image not created")
		go utility.NewHistoryPoint("ERROR: Thread image \"" + thread.Title + "\" was not changed - image not created")
		c.JSON(200, gin.H{
			"status": 3,
		})
		return
	}

	thread.Image = imageName

	db.Save(&thread)

	go utility.NewHistoryPoint("Image of thread \"" + thread.Title + "\" was changed")

	c.JSON(200, gin.H{
		"status": 0,
	})
}

func DeleteThread(c *gin.Context) {
	var request utility.NumRequest
	c.Bind(&request)

	db := models.DB()
	defer db.Close()

	var thread models.Thread
	db.First(&thread, request.Num)

	errFile := os.Remove("./covers/" + thread.Image)
	if errFile != nil {
		go utility.NewError("Failed to delete thread image")
		go utility.NewHistoryPoint("ERROR: Thread \"" + thread.Title + "\" was not deleted")
		c.JSON(200, gin.H{
			"status": 1,
		})
		return
	}

	go utility.NewHistoryPoint("Thread \"" + thread.Title + "\" was deleted")

	db.Delete(&thread)

	c.JSON(200, gin.H{
		"status": 0,
	})
}
