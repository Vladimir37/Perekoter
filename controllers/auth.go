package controllers

import (
	"Perekoter/utility"
	"Perekoter/models"

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
		c.JSON(403, gin.H{
			"status": 10,
		})
		c.AbortWithStatus(403)
		return
	}

	if config.Password == code {
		c.Next()
	} else {
		c.JSON(403, gin.H{
			"status": 10,
		})
		c.AbortWithStatus(403)
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

func AdminData(c *gin.Context) {
	db := models.DB()
	defer db.Close()

	var errors int
	db.Model(&models.Error{}).Where(models.Error{
		Active: true,
	}).Count(&errors)

	var issues int
	db.Model(&models.Issue{}).Where(models.Issue{
		Active: true,
	}).Count(&issues)

	response := map[string]int{
		"Errors": errors,
		"Issues": issues,
	}

	c.JSON(200, gin.H{
		"status": 0,
		"body": response,
	})
}