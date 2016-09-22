package main

import (
	"Perekoter/controllers"
	"Perekoter/models"
	"fmt"
	//"github.com/gin-gonic/gin"
	//"github.com/aubm/interval"
)

func main() {
	//router := gin.Default()
	//fmt.Println(models.Models())
	controllers.Login()
	models.Start()
	fmt.Println("Connection to the database was created!")
}
