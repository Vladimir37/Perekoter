package utility

import (
	"time"

	"github.com/aubm/interval"

	"Perekoter/models"
)

var stopCycle func()

func CycleIteration() {
	db := models.DB()
	defer db.Close()

	var threads []models.Thread
	db.Preload("Board").Find(&threads, models.Thread{
		Active: true,
	})

	for i := 0; i < len(threads); i++ {
		db.Model(&threads[i]).Related(&threads[i].Board)
		go CheckThread(threads[i])
	}
}

func StartInterval() {
	config := Config.Get()
	stopCycle = interval.Start(CycleIteration, time.Duration(config.Period)*time.Minute)
}

func RestartInterval() {
	config := Config.Get()

	stopCycle()

	stopCycle = interval.Start(CycleIteration, time.Duration(config.Period)*time.Minute)
}
