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

	db.Preload("Board").Find(&threads)

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
	title := c.PostForm("title")
	numbering := c.PostForm("numbering") != ""
	numberingSymbol := c.PostForm("numbering_symbol")
	roman := c.PostForm("roman") != ""
	currentNum, _ := strconv.Atoi(c.PostForm("current_num"))
	currentThread, _ := strconv.Atoi(c.PostForm("current_thread"))
	header := c.PostForm("header")
	headerLink := c.PostForm("header_link") != ""
	boardNum, _ := strconv.Atoi(c.PostForm("board_num"))
	redirect := c.PostForm("redirect") != ""

	db := models.DB()
	defer db.Close()

	var targetBoard models.Board
	db.First(&targetBoard, boardNum)

	imageName := strconv.FormatInt(time.Now().Unix(), 10) + ".png"

	img, _, errImg := c.Request.FormFile("cover")
	out, errFile := os.Create("./covers/" + imageName)

	if (errFile != nil) || (errImg != nil) {
		go utility.NewError("Failed to create thread - image not opened")
		go utility.NewHistoryPoint("ERROR: Thread \"" + title + "\" was not created - image not opened")
		c.JSON(200, gin.H{
			"status": 2,
		})
		return
	}

	defer out.Close()

	_, errWriting := io.Copy(out, img)

	if errWriting != nil {
		go utility.NewError("Failed to creating thread - image not created")
		go utility.NewHistoryPoint("ERROR: Thread \"" + title + "\" was not created - image not created")
		c.JSON(200, gin.H{
			"status": 3,
		})
		return
	}

	db.Create(&models.Thread{
		Numbering:       numbering,
		NumberingSymbol: numberingSymbol,
		Roman:           roman,
		CurrentNum:      currentNum,
		CurrentThread:   currentThread,
		Title:           title,
		HeaderLink:      headerLink,
		Header:          header,
		Image:           imageName,
		BoardID:         targetBoard.ID,
		Active:          true,
	})

	go utility.NewHistoryPoint("Thread \"" + title + "\" was created")

	if redirect {
		c.Redirect(301, "/threads")
	} else {
		c.JSON(200, gin.H{
			"status": 0,
		})
	}
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
	thread.NumberingSymbol = request.NumberingSymbol
	thread.Roman = request.Roman
	thread.CurrentNum = request.CurrentNum
	thread.CurrentThread = request.CurrentThread
	thread.Title = request.Title
	thread.HeaderLink = request.HeaderLink
	thread.Header = request.Header
	thread.Board = targetBoard
	thread.BoardID = targetBoard.ID

	db.Save(&thread)

	go utility.NewHistoryPoint("Thread \"" + request.Title + "\" was edited")

	c.JSON(200, gin.H{
		"status": 0,
	})
}

func UploadImage(c *gin.Context) {
	num := c.PostForm("num")
	redirect := c.PostForm("redirect") != ""

	db := models.DB()
	defer db.Close()

	var thread models.Thread
	db.First(&thread, num)

	imageName := strconv.FormatInt(time.Now().Unix(), 10) + ".png"

	img, _, errImg := c.Request.FormFile("cover")
	out, errFile := os.Create("./covers/" + imageName)

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

	if redirect {
		c.Redirect(301, "/threads")
	} else {
		c.JSON(200, gin.H{
			"status": 0,
		})
	}
}

func SwitchThreadActivity(c *gin.Context) {
	var request utility.NumRequest
	c.Bind(&request)

	db := models.DB()
	defer db.Close()

	var thread models.Thread
	db.First(&thread, request.Num)

	thread.Active = !thread.Active

	db.Save(&thread)

	var status string
	if thread.Active {
		status = "has been activated"
	} else {
		status = "has been deactivated"
	}

	go utility.NewHistoryPoint("Thread \"" + thread.Title + "\" " + status)

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
