package controllers

import (
	"Perekoter/utility"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	login := c.PostForm("login")
	password := c.PostForm("password")

	config := utility.Read()
	if (config.Login == login) && (config.Password == password) {
		//
	}
}
