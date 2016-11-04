package controllers

import (
	"strconv"

	"Perekoter/utility"

	"github.com/gin-gonic/gin"
)

func GetSettings(c *gin.Context) {
	config := utility.Config.Get()
	config.Login = ""
	config.Password = ""
	c.JSON(200, gin.H{
		"status": 0,
		"body":   config,
	})
}

func SetSetting(c *gin.Context) {
	login := c.PostForm("login")
	password := c.PostForm("password")
	period, errPeriod := strconv.Atoi(c.PostForm("period"))
	base := c.PostForm("login")

	if errPeriod != nil {
		c.JSON(200, gin.H{
			"status": 1,
		})
		return
	}

	config := utility.Config.Get()
	if (login != config.Login) || (password != config.Password) {
		c.JSON(200, gin.H{
			"status": 2,
		})
		return
	}

	config.Period = period
	config.Base = base

	err := utility.Config.Write(config)

	if err != nil {
		go utility.NewError("Failed to write to config")
		c.JSON(200, gin.H{
			"status": 3,
		})
	} else {
		go utility.NewHistoryPoint("Settings was edited")
		c.JSON(200, gin.H{
			"status": 0,
		})
	}
}

func SetUser(c *gin.Context) {
	oldLogin := c.PostForm("old_login")
	oldPassword := c.PostForm("old_password")
	newLogin := c.PostForm("new_login")
	newPassword := c.PostForm("new_password")

	config := utility.Config.Get()
	if (oldLogin != config.Login) || (oldPassword != config.Password) {
		c.JSON(200, gin.H{
			"status": 2,
		})
		return
	}

	config.Login = newLogin
	config.Password = newPassword

	err := utility.Config.Write(config)

	if err != nil {
		go utility.NewError("Failed to write to config")
		c.JSON(200, gin.H{
			"status": 3,
		})
	} else {
		go utility.NewHistoryPoint("User was edited")
		c.JSON(200, gin.H{
			"status": 0,
		})
	}
}

func ChangePasscode(c *gin.Context) {
	login := c.PostForm("login")
	password := c.PostForm("password")
	passcode := c.PostForm("passcode")

	config := utility.Config.Get()
	if (login != config.Login) || (password != config.Password) {
		c.JSON(200, gin.H{
			"status": 2,
		})
		return
	}

	config.Passcode = passcode
	err := utility.Config.Write(config)

	// TODO - проверка и активация нового пасскода

	if err != nil {
		go utility.NewError("Failed to write to config")
		c.JSON(200, gin.H{
			"status": 3,
		})
	} else {
		go utility.NewHistoryPoint("User was edited")
		c.JSON(200, gin.H{
			"status": 0,
		})
	}
}
