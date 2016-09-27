package controllers

import (
	"strconv"
    "io"
    "os"
    "time"

	"Perekoter/models"

	"github.com/gin-gonic/gin"
)

func AddThread(c *gin.Context) {
	numbering, errNum := strconv.ParseBool(c.PostForm("numbering"))
	roman, errRoman := strconv.ParseBool(c.PostForm("roman"))
	currentNum, errNum := strconv.Atoi(c.PostForm("current_num"))
	title := c.PostForm("title")
	headerLink, errHeaderLink := strconv.ParseBool(c.PostForm("header_link"))
	header := c.PostForm("header")
	boardNum, errBoard := strconv.Atoi(c.PostForm("board"))

    if (errNum != nil) || (errRoman != nil) || (errNum != nil) || (errHeaderLink != nil) || (errBoard != nil) {
        c.JSON(200, gin.H{
            "status": 1,
        })
    }

    db := models.DB()
	defer db.Close()

	var targetBoard models.Board
	db.First(&targetBoard, boardNum)

    imageName := strconv.FormatInt(time.Now().Unix(), 10) + ".png"

    img, _, errImg := c.Request.FormFile("cover")
    out, errFile := os.Open("./covers/" + imageName)

    if (errFile != nil) || (errImg != nil) {
        c.JSON(200, gin.H{
            "status": 2,
        })
    }

    defer out.Close()

    _, errWriting := io.Copy(out, img)

    if errWriting != nil {
        c.JSON(200, gin.H{
            "status": 3,
        })
    }


    db.Create(&models.Thread{
        Numbering: numbering,
        Roman: roman,
        CurrentNum: currentNum,
        Title: title,
        HeaderLink: headerLink,
        Header: header,
        Image: imageName,
        Board: targetBoard,
    })

    c.JSON(200, gin.H{
        "status": 0,
    })
}

func EditThread(c *gin.Context) {
    threadId, errId := strconv.Atoi(c.PostForm("thread_id"))

    numbering, errNum := strconv.ParseBool(c.PostForm("numbering"))
    roman, errRoman := strconv.ParseBool(c.PostForm("roman"))
    currentNum, errNum := strconv.Atoi(c.PostForm("current_num"))
    title := c.PostForm("title")
    headerLink, errHeaderLink := strconv.ParseBool(c.PostForm("header_link"))
    header := c.PostForm("header")
    boardNum, errBoard := strconv.Atoi(c.PostForm("board"))

    if (errNum != nil) || (errRoman != nil) || (errNum != nil) || (errHeaderLink != nil) || (errBoard != nil) || (errId != nil) {
        c.JSON(200, gin.H{
            "status": 1,
        })
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
    thread.Title = title
    thread.HeaderLink = headerLink
    thread.Header = header
    thread.Board = targetBoard

    db.Save(&thread)

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

    imageName := strconv.FormatInt(time.Now().Unix(), 10) + ".png"

    img, _, errImg := c.Request.FormFile("cover")
    out, errFile := os.Open("./covers/" + imageName)

    if (errFile != nil) || (errImg != nil) {
        c.JSON(200, gin.H{
            "status": 2,
        })
    }

    defer out.Close()

    _, errWriting := io.Copy(out, img)

    if errWriting != nil {
        c.JSON(200, gin.H{
            "status": 3,
        })
    }

    db := models.DB()
    defer db.Close()

    var thread models.Thread
    db.First(&thread, threadId)

    thread.Image = imageName

    db.Save(&thread)

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
        c.JSON(200, gin.H{
            "status": 1,
        })
    }

    db.Delete(&thread)
}