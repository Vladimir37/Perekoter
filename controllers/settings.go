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
	passcode := c.PostForm("passcode")
	base := c.PostForm("login")

	if errPeriod != nil {
		c.JSON(200, gin.H{
			"status": 1,
		})
	}

	config := utility.Config.Get()
	if (login != config.Login) || (password != config.Password) {
		c.JSON(200, gin.H{
			"status": 2,
		})
	}

	config.Period = period
	config.Passcode = passcode
	config.Base = base

	err := utility.Config.Write(config)

	if err != nil {
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
	old_login := c.PostForm("old_login")
	old_password := c.PostForm("old_password")
	new_login := c.PostForm("new_login")
	new_password := c.PostForm("new_password")

	config := utility.Config.Get()
	if (old_login != config.Login) || (old_password != config.Password) {
		c.JSON(200, gin.H{
			"status": 2,
		})
	}

	config.Login = new_login
	config.Password = new_password

	err := utility.Config.Write(config)

	if err != nil {
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
