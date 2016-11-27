package controllers

import (
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
	var request utility.ConfigRequest
	c.Bind(&request)

	config := utility.Config.Get()
	if (request.Login != config.Login) || (request.Password != config.Password) {
		c.JSON(200, gin.H{
			"status": 2,
		})
		return
	}

	if len(request.SecretKey) != 16 && len(request.SecretKey) != 24 && len(request.SecretKey) != 32 {
		go utility.NewError("Incorrect secret key length")
		c.JSON(200, gin.H{
			"status": 4,
		})
	}

	config.Period = request.Period
	config.Base = request.Base
	config.Botname = request.Botname
	config.Notification = request.Notification
	config.NotificationText = request.NotificationText
	config.SecretKey = request.SecretKey

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
	var request utility.UserChangingRequest
	c.Bind(&request)

	config := utility.Config.Get()
	if (request.OldLogin != config.Login) || (request.OldPassword != config.Password) {
		c.JSON(200, gin.H{
			"status": 2,
		})
		return
	}

	config.Login = request.NewLogin
	config.Password = request.NewPassword

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
	var request utility.PasscodeChangingRequest
	c.Bind(&request)

	config := utility.Config.Get()
	if (request.Login != config.Login) || (request.Password != config.Password) {
		c.JSON(200, gin.H{
			"status": 2,
		})
		return
	}

	config.Passcode = request.Passcode
	err := utility.Config.Write(config)

	// TODO - проверка и активация нового пасскода

	if err != nil {
		go utility.NewError("Failed to write to config")
		c.JSON(200, gin.H{
			"status": 3,
		})
	} else {
		go utility.NewHistoryPoint("Passcode was edited")
		c.JSON(200, gin.H{
			"status": 0,
		})
	}
}
