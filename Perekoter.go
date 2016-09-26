package main

import (
	"Perekoter/models"
	"fmt"
	"os"
	//"github.com/gin-gonic/gin"
	//"github.com/aubm/interval"
)

func main() {
	models.Init()
	fmt.Println("Connection to the database was created!")
	os.Mkdir("./covers", 0777)
	// router := gin.Default()

	// router.Run(":8080")
}
