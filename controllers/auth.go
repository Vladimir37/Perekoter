package controllers

import (
	"Perekoter/utility"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var request utility.LoginRequest
	c.Bind(&request)

	config := utility.Config.Get()
	if (config.Login == request.Login) && (config.Password == request.Password) {
		utility.SetCookie(c, "login", request.Password)
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
