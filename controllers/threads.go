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

    imageName := strconv.FormatInt(time.Now().Unix(), 10) + ".png"

    img, _, errImg := c.Request.FormFile("cover")
    out, errFile := os.Open("./covers/" + imageName)

    if (errFile != nil) || (errImg != nil) {
        c.JSON(200, gin.H{
            "status": 1,
        })
    }

    defer out.Close()

    _, errWriting := io.Copy(out, img)

    if errWriting != nil {
        c.JSON(200, gin.H{
            "status": 2,
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
}
