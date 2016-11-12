package controllers

import (
	"Perekoter/utility"
	"fmt"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var request utility.LoginRequest
	c.Bind(&request)

	config := utility.Config.Get()
	if (config.Login == request.Login) && (config.Password == request.Password) {
		code, err := utility.Encrypt(config.SecretKey, request.Password)

		if err != nil {
			go utility.NewHistoryPoint("Encription error")
			go utility.NewError("Failed to encrypt password")
			fmt.Println(err)
			c.JSON(200, gin.H{
				"status": 2,
			})
			return
		}

		utility.SetCookie(c, "login", code)
		go utility.NewHistoryPoint("User was logged")
		c.JSON(200, gin.H{
			"status": 0,
		})
	} else {
		c.JSON(200, gin.H{
			"status": 1,
		})
	}
}

func Logout(c *gin.Context) {
	utility.SetCookie(c, "login", "")
	c.JSON(200, gin.H{
		"status": 0,
	})
}

func CheckMiddleware(c *gin.Context) {
	config := utility.Config.Get()

	cookie, errCookie := utility.GetCookie(c, "login")
	code, errCode := utility.Decrypt(config.SecretKey, cookie)

	if errCookie != nil || errCode != nil {
		c.Redirect(403, "/")
	}

	if config.Password == code {
		c.Next()
	} else {
		c.Redirect(403, "/")
	}
}

func CheckRequest(c *gin.Context) {
	config := utility.Config.Get()

	cookie, errCookie := utility.GetCookie(c, "login")
	code, errCode := utility.Decrypt(config.SecretKey, cookie)

	if errCookie != nil || errCode != nil {
		c.JSON(200, gin.H{
			"status": 1,
		})
	}

	if config.Password == code {
		c.JSON(200, gin.H{
			"status": 0,
		})
	} else {
		c.JSON(200, gin.H{
			"status": 1,
		})
	}
}
