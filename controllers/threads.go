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
	num, err := strconv.Atoi(c.PostForm("num"))

	if err != nil {
		c.JSON(200, gin.H{
			"status": 1,
		})
	}

	db := models.DB()
	defer db.Close()

	var thread models.Thread
	db.First(thread, num)

	c.JSON(200, gin.H{
		"status": 0,
		"body":   thread,
	})
}

func AddThread(c *gin.Context) {
	numbering, errNum := strconv.ParseBool(c.PostForm("numbering"))
	roman, errRoman := strconv.ParseBool(c.PostForm("roman"))
	currentNum, errNum := strconv.Atoi(c.PostForm("current_num"))
	currentThread, errThread := strconv.Atoi(c.PostForm("current_thread"))
	title := c.PostForm("title")
	headerLink, errHeaderLink := strconv.ParseBool(c.PostForm("header_link"))
	header := c.PostForm("header")
	boardNum, errBoard := strconv.Atoi(c.PostForm("board"))

	correctData := (errNum != nil) || (errRoman != nil) || (errNum != nil) || (errHeaderLink != nil) || (errBoard != nil)

	if correctData {
		go utility.NewError("Failed to create thread - incorrect data")
		go utility.NewHistoryPoint("ERROR: Thread \"" + title + "\" was not created - incorect data")
		c.JSON(200, gin.H{
			"status": 1,
		})
	}

	if errThread != nil {
		currentThread = 0
	}

	db := models.DB()
	defer db.Close()

	var targetBoard models.Board
	db.First(&targetBoard, boardNum)

	imageName := strconv.FormatInt(time.Now().Unix(), 10) + ".png"

	img, _, errImg := c.Request.FormFile("cover")
	out, errFile := os.Open("./covers/" + imageName)

	if (errFile != nil) || (errImg != nil) {
		go utility.NewError("Failed to create thread - image not opened")
		go utility.NewHistoryPoint("ERROR: Thread \"" + title + "\" was not created - image not opened")
		c.JSON(200, gin.H{
			"status": 2,
		})
	}

	defer out.Close()

	_, errWriting := io.Copy(out, img)

	if errWriting != nil {
		go utility.NewError("Failed to creating thread - image not created")
		go utility.NewHistoryPoint("ERROR: Thread \"" + title + "\" was not created - image not created")
		c.JSON(200, gin.H{
			"status": 3,
		})
	}

	db.Create(&models.Thread{
		Numbering:     numbering,
		Roman:         roman,
		CurrentNum:    currentNum,
		CurrentThread: currentThread,
		Title:         title,
		HeaderLink:    headerLink,
		Header:        header,
		Image:         imageName,
		Board:         targetBoard,
		BoardID:       targetBoard.ID,
		Active:        true,
	})

	go utility.NewHistoryPoint("Thread \"" + title + "\" was created")

	c.JSON(200, gin.H{
		"status": 0,
	})
}

func EditThread(c *gin.Context) {
	threadId, errId := strconv.Atoi(c.PostForm("thread_id"))

	numbering, errNum := strconv.ParseBool(c.PostForm("numbering"))
	roman, errRoman := strconv.ParseBool(c.PostForm("roman"))
	active, errActive := strconv.ParseBool(c.PostForm("active"))
	currentNum, errNum := strconv.Atoi(c.PostForm("current_num"))
	currentThread, errThread := strconv.Atoi(c.PostForm("current_thread"))
	title := c.PostForm("title")
	headerLink, errHeaderLink := strconv.ParseBool(c.PostForm("header_link"))
	header := c.PostForm("header")
	boardNum, errBoard := strconv.Atoi(c.PostForm("board"))

	correctData := (errNum != nil) || (errRoman != nil) || (errNum != nil) || (errHeaderLink != nil) || (errBoard != nil) || (errId != nil) || (errActive != nil)

	if correctData {
		go utility.NewError("Failed to edit thread - incorrect data")
		go utility.NewHistoryPoint("ERROR: Thread \"" + title + "\" was not edited - incorrect data")
		c.JSON(200, gin.H{
			"status": 1,
		})
	}

	if errThread != nil {
		currentThread = 0
	}

	db := models.DB()
	defer db.Close()

	var targetBoard models.Board
	db.First(&targetBoard, boardNum)

	var thread models.Thread
	db.First(&thread, threadId)

	thread.Numbering = numbering
	thread.Roman = roman
	thread.CurrentNum = currentNum
	thread.CurrentThread = currentThread
	thread.Title = title
	thread.HeaderLink = headerLink
	thread.Header = header
	thread.Board = targetBoard
	thread.BoardID = targetBoard.ID
	thread.Active = active

	db.Save(&thread)

	go utility.NewHistoryPoint("Thread \"" + title + "\" was created")

	c.JSON(200, gin.H{
		"status": 0,
	})
}

func UploadImage(c *gin.Context) {
	threadId, errId := strconv.Atoi(c.PostForm("thread_id"))
	if errId != nil {
		c.JSON(200, gin.H{
			"status": 1,
		})
	}

	db := models.DB()
	defer db.Close()

	var thread models.Thread
	db.First(&thread, threadId)

	imageName := strconv.FormatInt(time.Now().Unix(), 10) + ".png"

	img, _, errImg := c.Request.FormFile("cover")
	out, errFile := os.Open("./covers/" + imageName)

	if (errFile != nil) || (errImg != nil) {
		go utility.NewError("Failed to upload new thread image - image not opened")
		go utility.NewHistoryPoint("ERROR: Thread image \"" + thread.Title + "\" was not changed - image not opened")
		c.JSON(200, gin.H{
			"status": 2,
		})
	}

	defer out.Close()

	_, errWriting := io.Copy(out, img)

	if errWriting != nil {
		go utility.NewError("Failed to upload new thread image - image not created")
		go utility.NewHistoryPoint("ERROR: Thread image \"" + thread.Title + "\" was not changed - image not created")
		c.JSON(200, gin.H{
			"status": 3,
		})
	}

	thread.Image = imageName

	db.Save(&thread)

	go utility.NewHistoryPoint("Image of thread \"" + thread.Title + "\" was changed")

	c.JSON(200, gin.H{
		"status": 0,
	})
}

func DeleteThread(c *gin.Context) {
	threadId, errId := strconv.Atoi(c.PostForm("thread_id"))
	if errId != nil {
		c.JSON(200, gin.H{
			"status": 1,
		})
	}

	db := models.DB()
	defer db.Close()

	var thread models.Thread
	db.First(&thread, threadId)

	errFile := os.Remove("./covers/" + thread.Image)
	if errFile != nil {
		go utility.NewError("Failed to delete thread image")
		go utility.NewHistoryPoint("ERROR: Thread \"" + thread.Title + "\" was not deleted")
		c.JSON(200, gin.H{
			"status": 1,
		})
	}

	go utility.NewHistoryPoint("Thread \"" + thread.Title + "\" was deleted")

	db.Delete(&thread)

	c.JSON(200, gin.H{
		"status": 0,
	})
}
