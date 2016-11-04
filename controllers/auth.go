package controllers

import (
	"Perekoter/utility"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	login := c.PostForm("login")
	password := c.PostForm("password")

	config := utility.Config.Get()
	if (config.Login == login) && (config.Password == password) {
		utility.SetCookie(c, "login", password)
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
	cookie, err := utility.GetCookie(c, "login")
	if err != nil {
		c.Redirect(403, "/")
	}
	config := utility.Config.Get()
	if config.Password == cookie {
		c.Next()
	} else {
		c.Redirect(403, "/")
	}
}

func CheckRequest(c *gin.Context) {
	cookie, err := utility.GetCookie(c, "login")
	if err != nil {
		c.Redirect(403, "/")
	}
	config := utility.Config.Get()
	if config.Password == cookie {
		c.JSON(200, gin.H{
			"status": 0,
		})
	} else {
		c.JSON(200, gin.H{
			"status": 1,
		})
	}
}
