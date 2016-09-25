package main

import (
	"Perekoter/controllers"
	"Perekoter/models"
	"fmt"
	//"github.com/gin-gonic/gin"
	//"github.com/aubm/interval"
)

func main() {
	models.Init()
	fmt.Println("Connection to the database was created!")
	//router := gin.Default()
}
