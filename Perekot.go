package main

import (
    "fmt"
    "Perekoter/models"

    //"github.com/gin-gonic/gin"
    //"github.com/aubm/interval"
)

func main() {
    //router := gin.Default()
    //fmt.Println(models.Models())
    models.Start()
    fmt.Println("Connection to the database was created!")
}
