package main

import (
	"Perekoter/core"
	"Perekoter/models"
	"Perekoter/utility"
	"fmt"
	"os"

	"github.com/aubm/interval"
	//"github.com/aubm/interval"
	"time"
)

func main() {
	models.Init()
	fmt.Println("Connection to the database was created!")
	os.Mkdir("./covers", 0777)
	utility.Config.Read()
	config := utility.Config.Get()

	utility.CurrentUsercode.PasscodeAuth()
	// TODO через интервал
	// utility.Cycle()
	interval.Start(utility.Cycle, time.Duration(config.Period)*time.Minute)

	router := core.GetRouter()

	router.Run(":" + config.Port)
}
